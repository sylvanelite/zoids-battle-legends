
//https://github.com/ilia3101/Javascript-3D-Renderer/tree/master (unlicense)

interface IModel{
    objectname:string,
    origin:[number,number,number],
    //// All points are given in an array of arrays, points MUST HAVE a 1 at the end (don't pay any attention to it) #2darray #joodethenoobe=
    points:Array<[number,number,number,number]>,
    materials:Array<string>,/*e.g.[
        '#c00',
        '#c80',
    ], */
// Triangles also in array of arrays, like this 1: [point_index_1, point_index_2, point_index_3, material_index]
    triangles:Array<[number,number,number,number]>,
    location: [number,number,number],
    rotation: [number,number,number],
    wireframe: boolean,
    pointsize: number,

    //--for computation?
    movedpoints:Array<Array<number>>,
    tridistance:Array<number>,
    tridistancecopy:Array<number>,
    screenpoints:Array<Array<number>>,
    pointdist:Array<number>,
}

interface ICamera{
    location:[number,number,number],
    rotation:[number,number,number],
    fov:number
}
interface ILight{
    intensity: number,
    colour: string,
    direction: [ number,number,number]
}
interface IScene{
    objects: Array<IModel>,
    camera:ICamera,
    ambient:string,
    light:ILight,
    //for computation?
    
    triorder: Array<Array<number>>,
}

type Matrix=[
[number,number,number,number],
[number,number,number,number],
[number,number,number,number],
[number,number,number,number]
];
type Vector=Array<number>


// Normalises a vector (3D only)
function normalise(vector:Vector)
{
    // Get length of the vector
    const length = Math.sqrt( vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2] );
    // Divide all parts by length
    const normalised = [ ( vector[0] / length ), ( vector[1] / length ), ( vector[2] / length ) ];
    return normalised;
}

// Get dot product, useful for shading and matrix
function dotproduct(vector1:Vector, vector2:Vector)
{
    let dotproduct = 0;
    for (let i = 0; i < vector1.length; i++){ 
        dotproduct = dotproduct + vector1[i] * vector2[i];
    }
    return dotproduct;
}

// Calculates normal of a triangle from 3 points using cross product method
function normal(point1:Vector, point2:Vector, point3:Vector)
{
    const vectora = [ ( point1[0] - point2[0] ), ( point1[1] - point2[1] ), ( point1[2] - point2[2] ) ];
    const vectorb = [ ( point3[0] - point2[0] ), ( point3[1] - point2[1] ), ( point3[2] - point2[2] ) ];
    const crossproduct:Vector = 
    [
        ( vectora[1] * vectorb[2] - vectora[2] * vectorb[1] ),
        ( vectora[2] * vectorb[0] - vectora[0] * vectorb[2] ),
        ( vectora[0] * vectorb[1] - vectora[1] * vectorb[0] )
    ];
    const normal = normalise(crossproduct);
    return normal;
}

// Function for transforming a point using a 4x4 matrix
function pointmatrix(point:Vector, matrix:Matrix)
{
    const newpoint = new Array<number>(point.length);
    // Go through point and do the matrix
    for (let p = 0; p < 4; p++)
    { newpoint[p] = dotproduct(matrix[p], point); }
    return newpoint;
}

// Basic 2D rotation function, uses radians
function rotate2d(oldx:number, oldy:number, angle:number)
{
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const newx = ( oldx * cos ) - ( oldy * sin );
    const newy = ( oldy * cos ) + ( oldx * sin );
    return [newx, newy];
}

// Simple function for getting radians from degrees - Rounds to 5 decimal points otherwise javascript goes funny
function radians(degrees:number) { return Math.round( degrees / 180 * Math.PI * 100000 ) / 100000; }

function shade(colour:string, 
    ambient:string, 
    lightvector:Vector, 
    litecol:string, 
    intensity:number, 
    facenormal:Vector, greyblend:number)
{
    const rgbcol = [ (parseInt(colour[1], 16) / 15), (parseInt(colour[2], 16) / 15), (parseInt(colour[3], 16) / 15) ];
    const rgbamb = [ (parseInt(ambient[1], 16) / 15), (parseInt(ambient[2], 16) / 15), (parseInt(ambient[3], 16) / 15) ];
    const rgblit = [ (parseInt(litecol[1], 16) / 15), (parseInt(litecol[2], 16) / 15), (parseInt(litecol[3], 16) / 15) ];
    const newcol = new Array(3);
    const lightangle = dotproduct(lightvector, facenormal);
    // Get grey color
    const grey = rgbcol[0] * 0.299 + rgbcol[1] * 0.587 + rgbcol[2] * 0.114;
    // Shade all channels
    for (let c = 0; c < 3; c++)
    {
        // Add ambient background effect
        newcol[c] = (rgbcol[c] * rgbamb[c]);
        // Main light shading
        if (lightangle > 0)
        { newcol[c] = newcol[c] + (Math.pow( ( rgbcol[c] * lightangle * rgblit[c] * intensity ), 0.45 ) + 0.06 / 1.06); }
        // Grey fresnel effect thing
        // if (greyblend < 0) {greyblend = 0}
        newcol[c] = newcol[c] + Math.pow( (grey * (1 - greyblend) ), 1.2 );
        // Make it a 0-255 thing
        newcol[c] = Math.round(newcol[c] * 255);
    }
    // Return as rgb
    return 'rgb(' + newcol[0] + ',' + newcol[1] + ',' + newcol[2] + ')'
}

// Rotates a 4x4 matrix, arguments: matrix, origin point, rotation: [x,y,z], in degrees
function rotatematrix(matrix:Matrix, originpoint:Vector, rotation:Vector):Matrix
{
    // Create new 4x4 matrix
    const newmatrix:Matrix = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,1],
    ];
    
    // Convert degrees to radians
    const rotationradians = new Array(3);
    for (let rotaxis = 0; rotaxis < 3; rotaxis++)
    { rotationradians[rotaxis] = radians(rotation[rotaxis]); }

    // Rotate center point first (right column of matrix)
    // Move it to origin
    newmatrix[0][3] = matrix[0][3] - originpoint[0];
    newmatrix[1][3] = matrix[1][3] - originpoint[1];
    newmatrix[2][3] = matrix[2][3] - originpoint[2];
    // Go through all 3 axis
    for (let rotaxis = 0; rotaxis < 3; rotaxis++)
    {
        // Rotation begins
        const angle = rotationradians[rotaxis]
        // These are only 'xaxis' and 'yaxis' becos rotatiion is done in imaginary 2D
        const xaxis = ( (rotaxis + 1) % 3 );
        const yaxis = ( (rotaxis + 2) % 3 );
        const rotated = rotate2d( newmatrix[xaxis][3], newmatrix[yaxis][3], angle );
        newmatrix[xaxis][3] = rotated[0];
        newmatrix[yaxis][3] = rotated[1];
    }
    // Move back from origin
    newmatrix[0][3] = newmatrix[0][3] + originpoint[0];
    newmatrix[1][3] = newmatrix[1][3] + originpoint[1];
    newmatrix[2][3] = newmatrix[2][3] + originpoint[2];

    // Loop through x-y-z vectors or points or whatever it is
    for (let mp = 0; mp < 3; mp++)
    {
        // Move vector/point to rotation location by subtracting origin and adding matrix location
        newmatrix[mp][0] = matrix[mp][0] - originpoint[0] + matrix[0][3];
        newmatrix[mp][1] = matrix[mp][1] - originpoint[1] + matrix[1][3];
        newmatrix[mp][2] = matrix[mp][2] - originpoint[2] + matrix[2][3];
        // Rotate on every axis in 2d (order xyz)
        for (let rotaxis = 0; rotaxis < 3; rotaxis++)
        {
            // Rotation begins
            const angle = rotationradians[rotaxis]
            // These are only 'xaxis' and 'yaxis' becos rotatiion is done in imaginary 2D
            const xaxis = ( (rotaxis + 1) % 3 );
            const yaxis = ( (rotaxis + 2) % 3 );
            const rotated = rotate2d( newmatrix[mp][xaxis], newmatrix[mp][yaxis], angle );
            newmatrix[mp][xaxis] = rotated[0];
            newmatrix[mp][yaxis] = rotated[1];
        }
        // Move back from rotation location and origin
        newmatrix[mp][0] = newmatrix[mp][0] + originpoint[0] - newmatrix[0][3];
        newmatrix[mp][1] = newmatrix[mp][1] + originpoint[1] - newmatrix[1][3];
        newmatrix[mp][2] = newmatrix[mp][2] + originpoint[2] - newmatrix[2][3];
    }
    return newmatrix;
}

// Main render function
function render(ctx:CanvasRenderingContext2D, renderscene:IScene)
{
    // Start timing
//    console.time('render');
    // Give the camera a nice name
    const thecamera = renderscene.camera;
    // Get field of view - sensor size(mm) / focal length(mm)
    const camerafov = 36 / thecamera.fov;
    // Collect other camera info
    const cameraloc = thecamera.location;
    // subtract 90 from cameras X rotation becos X = 90 means looking ahead
    const camerarot = [ ( thecamera.rotation[0] - 90 ), ( - thecamera.rotation[1] ), ( - thecamera.rotation[2] ) ];

    // Get resolution of canvas, its useful and stuff
    const xres = ctx.canvas.width;
    const yres = ctx.canvas.height;

    // Create camera matrix
    let cammatrix:Matrix = 
    [
        [ 1, 0, 0,  0 ],
        [ 0, 1, 0,  0 ],
        [ 0, 0, 1,  0 ],

        [ 0, 0, 0,  1 ]
    ];
    // Rotate matrix (camera rotation) origin 0,0,0 coz camera movement is done
    cammatrix = rotatematrix( cammatrix, [0,0,0], camerarot );

    // Go through objects and do transformations
    for (let o = 0; o < renderscene.objects.length; o++)
    {
        // Give object a nice name
        const theobject = renderscene.objects[o];
        // Find out where the object is
        const objectloc = theobject.location;
        // Get object's rotation
        const objrotation = theobject.rotation;
        // Find out how many points object has
        const pointnum = theobject.points.length;
        // Add property to object for storing new point locations
        theobject.movedpoints = new Array(pointnum);
        // Create 4x4 matrix for object transformation
        let objmatrix:Matrix = 
        [
            [ 1, 0, 0,  objectloc[0] ],
            [ 0, 1, 0,  objectloc[1] ],
            [ 0, 0, 1,  objectloc[2] ],

            [ 0, 0, 0,             1 ]
        ];
        // Rotate matrix - object rotation first
        objmatrix = rotatematrix( objmatrix, objectloc, objrotation );
        // Create camera matrix
        objmatrix[0][3] = objmatrix[0][3] - cameraloc[0];
        objmatrix[1][3] = objmatrix[1][3] - cameraloc[1];
        objmatrix[2][3] = objmatrix[2][3] - cameraloc[2];

        // Loop through all points and do matrix transformation
        for (let p = 0; p < pointnum; p++)
        {
            const point = theobject.points[p];
            // Use pointmatrix function to apply object matrix then camera matrix
            let newpoint = pointmatrix(point, objmatrix);
            newpoint = pointmatrix(newpoint, cammatrix);
            // Save modified point
            theobject.movedpoints[p] = newpoint;
        }
    }

    // Go through all objects and calculate every point's screen location and distance from camera
    for (let o = 0; o < renderscene.objects.length; o++)
    {
        // Give object a nice name
        const theobject = renderscene.objects[o];
        // Find out how many points object has
        const pointnum = theobject.points.length;
        // Add property to object for storing screen point locations
        theobject.screenpoints = new Array(pointnum);
        // Add property to object for storing point distance from camera
        theobject.pointdist = new Array(pointnum);
        // Loop through all points and calculate screen location and distance
        for (let p = 0; p < pointnum; p++)
        {
            const point = theobject.movedpoints[p];
            // Calculate X and Y screen locations by dividing sideways and upways offset by Z depth
            const screenx = (0.5 + point[0] / point[1] / camerafov * 1) * xres; // X has to be plus
            const screeny = (0.5 - point[2] / point[1] / camerafov * 1) * xres - ((xres - yres) / 2 );
            // Now put the screen location in to the array made a few lines ago
            theobject.screenpoints[p] = [screenx, screeny];

            // Calculate distace wiv pythagoras
            const distance = Math.sqrt( point[0] * point[0] + point[1] * point[1] + point[2] * point[2] );
            // Put the distance in to the distance property
            theobject.pointdist[p] = distance;
        }
    }
    
    // Triangle time...

    // For counting number of triangles in the scene
    let tritotal = 0;

    // Calculate distance of every triangle
    for (let o = 0; o < renderscene.objects.length; o++)
    {
        // Give object a nice name
        const theobject = renderscene.objects[o];
        // Find out how many triangles the object has
        const trinum = theobject.triangles.length;
        // Add propery to object to contain triangle distances from camera
        theobject.tridistance = new Array(trinum);
        theobject.tridistancecopy = new Array(trinum);
        // Now calculate and record those distances
        for (let t = 0; t < trinum; t++)
        {
            const distance = ( theobject.pointdist[ theobject.triangles[t][0] ] + theobject.pointdist[ theobject.triangles[t][1] ] +theobject.pointdist[ theobject.triangles[t][2] ] ) / 3;
            theobject.tridistance[t] = distance;
            theobject.tridistancecopy[t] = distance;
        }
        // Add to count
        tritotal = tritotal + trinum;
    }

    // Sort triangle render order by distance
    renderscene.triorder = new Array(tritotal);
    let furthestindex = [0,0];
    for (let n = 0; n < tritotal; n++)
    {
        // Furthest triangle
        let furthest = 0;
        for (let o = 0; o < renderscene.objects.length; o++)
        {
            // Give object a nice name
            const theobject = renderscene.objects[o];
            // Check every triangle in the object
            for (let t = 0; t < theobject.triangles.length; t++)
            {
                // Check if current triangle is furthest (yet)
                if ( theobject.tridistance[t] > furthest )
                {
                    furthest = theobject.tridistance[t] * 1;
                    furthestindex = [o, t]; // Record furthest triangle as: [ index_of_object, index_of_triangle_in_that_object ]
                }
            }
        }
        // Save furthest to triorder array
        renderscene.triorder[n] = furthestindex;
        // Set distance of that triangle to 0 to not interfere with other ones
        renderscene.objects[ furthestindex[0] ].tridistance[ furthestindex[1] ] = 0;
    }
    
    // Fill background in with scene's ambient colour
    const ambientcolour = renderscene.ambient;
    ctx.beginPath();
    ctx.rect(0,0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = ambientcolour;
    ctx.fill();

    // LIGHT PROPERTIES
    const lightvector = normalise(renderscene.light.direction);
    const lightcol = renderscene.light.colour;
    const intensity = renderscene.light.intensity;

    // Drawing the triangles
    for (let t = 0; t < renderscene.triorder.length; t++)
    {
        const theobject = renderscene.objects[ renderscene.triorder[t][0] ];
        const triangle = theobject.triangles[ renderscene.triorder[t][1] ];
        // Get points of triangle
        let p1 = theobject.movedpoints[ triangle[0] ];
        let p2 = theobject.movedpoints[ triangle[1] ];
        let p3 = theobject.movedpoints[ triangle[2] ];
        // Get vector of camera to triangle
        const cameravector = normalise( [ (p1[0] + p2[0] + p3[0]), (p1[1] + p2[1] + p3[1]), (p1[2] + p2[2] + p3[2]) ] );
        // Check if triangle is behind camera
        const ydist = p1[1] + p2[1] + p3[1];
        if (ydist > 7){
            const trinormal = normal( p1, p2, p3 );
            // Get screen points
             p1 = theobject.screenpoints[ triangle[0] ];//these were redeclared from above??
             p2 = theobject.screenpoints[ triangle[1] ];
             p3 = theobject.screenpoints[ triangle[2] ];
            // Check if triangle faces towards camera using dotproduct
            const dotprod = dotproduct( trinormal, cameravector )
            if ( theobject.wireframe == true || dotproduct( trinormal, cameravector ) > 0 )
            {
                // Get dotproduct of face with a straight line for fresnel(camera line causes weirness)
                const dotprod = dotproduct( trinormal, [0,1,0] );
                // Only do shading if non-wireframe
                const colour =  (theobject.wireframe == false?
                     shade( theobject.materials[ triangle[3] ], ambientcolour, lightvector, lightcol, intensity, trinormal, dotprod )
                    : theobject.materials[ triangle[3] ]); 
                ctx.beginPath();
                ctx.moveTo( p1[0], p1[1] );
                ctx.lineTo( p2[0], p2[1] );
                ctx.lineTo( p3[0], p3[1] );
                ctx.closePath();
                // Stroke line always drawn, otherwise there are gaps between triangles
                ctx.strokeStyle = colour;
                ctx.stroke();
                // Only fill if object is non-wireframe
                if (theobject.wireframe == false) 
                {
                    ctx.fillStyle = colour;
                    ctx.fill();
                }
            }
        }
    }

    // End timing
//    console.timeEnd('render');
}

export {render,ICamera,ILight,IScene,IModel}
