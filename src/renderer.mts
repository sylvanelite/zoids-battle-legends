

interface IVertexRes{//from the loader file
    pos:[number,number,number];
    nrm:[number,number,number];
    tx0:[number,number];//note: assigned, but currently unused
}
class IDisplayObjeRes{
    type:number;
    verts:Array<IVertexRes> = [];
}
const render=(props:Record<number,any>)=>{
    const displayLists = [];
    for(const prop of Object.values(props)){
        if(prop.displayList){
            displayLists.push(prop.displayList);//NOTE: this doesn't have transforms...
        }
    }
    console.log(displayLists);
    const models:Array<IModel> = [];
    for(const displayListArrs of displayLists){
        const displayListArr= displayListArrs as Array<IDisplayObjeRes>;
        //these seem to be rects? between 0.5->0.5 
        //cube has 24 verts: 6 faces with 4 corner verts = 24  

        if(displayListArr.length==1&&displayListArr[0].verts.length==24){
            console.log("skipping 24 vert");
            continue;
        }
        //these are more interesting, have more complex geometry
        for(const displayList of displayListArr){
            const model = renderVerts(displayList);
            if(model){
                models.push(model);
            }
        }


    }
/*  //enable software renderer
    // Make camera
    const camera:ICamera = {
        location: [1.3, 4, 24],
        rotation: [0, 0, 0],
        fov: 35
    };
    const light:ILight = {
        intensity: 1,
        colour: '#fcd',
        direction: [ -1, 0.9, -1.4]
    };
    // Make a scene: array of all objects, camera, ambient colour, lamp, materials(array)
    const introscene:IScene = {
        objects: models,
        camera: camera,
        ambient: '#269',
        light: light,
        triorder:[]
    };
    const canvas3d = document.createElement("canvas");
    canvas3d.width = 512;
    canvas3d.height = 512;
    const context3d = canvas3d.getContext('2d');
    const draw=()=>{
            for(const model of introscene.objects){
                model.rotation[0] = model.rotation[0] - 0.085; 
                model.rotation[1] = model.rotation[1] - 0.3; 
                model.rotation[2] = model.rotation[2] + 0.12;
            }
            r3d(context3d,introscene);
            window.requestAnimationFrame(draw);

    }
    window.requestAnimationFrame(draw);
    document.body.appendChild(context3d.canvas)
    document.body.appendChild(canvas3d);
    */
    return (toObj(models));
}
import  {render as r3d,ICamera,ILight,IScene,IModel} from './renderer/js-3d.mjs';

let materialIdx = 0;
const materials = [ '#f71', '#126', '#eb3', '#f71', '#e29', '#1b6', '#2cf', '#c00', '#c80'];

//https://burtleburtle.net/bob/rand/smallprng.html (I wrote this PRNG. I place it in the public domain. )
//https://github.com/bryc/code/blob/master/jshash/PRNGs.md (License: Public domain. )
//https://gist.github.com/imneme/85cff47d4bad8de6bdeb671f9c76c814 - The MIT License (MIT)
//JSF / smallprng
// 3-rotate version, improves randomness.
interface IPRNG{
    A:number,B:number,C:number,D:number
}
class PRNG{
    static seed(seed:number):IPRNG{
        return {
            A:seed,
            B:seed*10,
            C:seed*100,
            D:seed*1000
        };
    }
	static prng(prng:IPRNG){
		prng.A |= 0; prng.B |= 0; prng.C |= 0; prng.D |= 0;
		const t = prng.A - (prng.B << 23 | prng.B >>> 9) | 0;
		prng.A = prng.B ^ (prng.C << 16 | prng.C >>> 16) | 0;
		prng.B = prng.C + (prng.D << 11 | prng.D >>> 21) | 0;
		prng.B = prng.C + prng.D | 0;
		prng.C = prng.D + t | 0;
		prng.D = prng.A + t | 0;
		
		return (prng.D >>> 0) / 4294967296;//remove divide to make an int instead of float?
	}
};
const rngInstance = PRNG.seed(42);
const jitter=(points:Array<[number,number,number,number]>)=>{
    //software renderer seems to have Z fighting or something like it?
    //for debugging: add small offset so Z values are different 
    const queryParams = new URLSearchParams(window.location.search);
    if(queryParams.get("nojit")){return;}
    for(const p of points){
        const rng = PRNG.prng(rngInstance);
        p[0]*=(rng>0.5?1.003:0.997);
        p[1]*=(rng>0.5?1.003:0.997);
        p[2]*=(rng>0.5?1.003:0.997);
    }
}
const renderVerts = (displayList:IDisplayObjeRes)=>{
    //convert to the format used by the software renderer.
    // Materials that will be used
    
    const model:IModel = {
        objectname:'test',
        origin:[0,0,0],
        //// All points are given in an array of arrays, points MUST HAVE a 1 at the end (don't pay any attention to it) #2darray #joodethenoobe=
        points:[],
        materials,
        // Triangles also in array of arrays, like this 1: [point_index_1, point_index_2, point_index_3, material_index]
        triangles:[],
        location: [0,0,0],
        rotation: [0,0,0],
        wireframe: false,
        pointsize: 1,
    
        //--for computation?
        movedpoints:[],
        tridistance:[],
        tridistancecopy:[],
        screenpoints:[],
        pointdist:[],
    };
    const scale = 0.1;
    materialIdx+=1;
    materialIdx = materialIdx%materials.length;

    switch(displayList.type){
        case PRIMITIVE_TYPES.GL_TRIANGLE_STRIP:
            for(let v=0;v<displayList.verts.length;v+=1){
                const A = displayList.verts[v];
                model.points.push([A.pos[0]*scale,A.pos[1]*scale,A.pos[2]*scale,1]);
            }
            jitter(model.points);
            model.triangles = PrimitiveToTriangles.fromTriangleStrip(model.points,materialIdx);
            return model;
        case PRIMITIVE_TYPES.GL_QUADS:
            for(let v=0;v<displayList.verts.length;v+=4){
                const A = displayList.verts[v];
                const B = displayList.verts[v+1];
                const C = displayList.verts[v+2];
                const D = displayList.verts[v+3];
                model.points.push([A.pos[0]*scale,A.pos[1]*scale,A.pos[2]*scale,1]);
                model.points.push([B.pos[0]*scale,B.pos[1]*scale,B.pos[2]*scale,1]);
                model.points.push([C.pos[0]*scale,C.pos[1]*scale,C.pos[2]*scale,1]);
                model.points.push([D.pos[0]*scale,D.pos[1]*scale,D.pos[2]*scale,1]);
            }
            jitter(model.points);
            model.triangles = PrimitiveToTriangles.fromQuad(model.points,materialIdx);
            return model;
        case PRIMITIVE_TYPES.GL_TRIANGLES:
            for(let v=0;v<displayList.verts.length;v+=1){
                const A = displayList.verts[v];
                model.points.push([A.pos[0]*scale,A.pos[1]*scale,A.pos[2]*scale,1]);
            }
            jitter(model.points);
            model.triangles = PrimitiveToTriangles.fromTriangle(model.points,materialIdx);
            return model;
        default:
            console.warn("unknown primitive type")
    }

    console.log("!!! renderer not implemented:",displayList.type)
    return null;

}

enum PRIMITIVE_TYPES  {
    /**
    //https://www.gc-forever.com/yagcd/chap5.html
    0x00	NOP - No Operation
    0x08	Load CP REG
    0x10	Load XF REG
    0x20	Load INDX A
    0x28	Load INDX B
    0x30	Load INDX C
    0x38	Load INDX D
    0x40	CALL DL - Call Displaylist
    0x48	Invalidate Vertex Cache
    0x61	Load BP REG (SU_ByPassCmd)
    0x80	QUADS - Draw Quads (*)
    0x90	TRIANGLES - Draw Triangles (*)
    0x98	TRIANGLESTRIP - Draw Triangle Strip (*)
    0xA0	TRIANGLEFAN - Draw Triangle Fan (*)
    0xA8	LINES - Draw Lines (*)
    0xB0	LINESTRIP - Draw Line Strip (*)
    0xB8	POINTS - Draw Points (*)
	GL_POINTS=0xB8,
	GL_LINES= 0xA8, 
	GL_LINE_STRIP=0xB0, 
	GL_TRIANGLE_FAN= 0xA0,  */
	GL_TRIANGLES=0x90, 
	GL_TRIANGLE_STRIP=0x98, 
	GL_QUADS=0x80,
};

class PrimitiveToTriangles
{
    static fromTriangleStrip(input:Array<Array<number>>,material:number):Array<[number,number,number,number]>
    {
        const res:Array<[number,number,number,number]> = [];
        for (let i = 0; i < input.length - 2; i+=1)
        {
            //direction will alternate along the strip
            const tri = (i % 2 == 1) ?
                [i,i+1,i+2]:
                [i,i+2,i+1];
            res.push([...tri,material] as [number,number,number,number]);
        }
        return res;
    }
    static fromQuad(input:Array<Array<number>>,material:number):Array<[number,number,number,number]>
    {
        const res:Array<[number,number,number,number]> = [];
        for (let i = 0; i < input.length; i+=4)
        {
            //split quad into 2 tris
            res.push([i+2,i+1,i,  material]);
            res.push([i,  i+3,i+2,material]);
        }
        return res;
    }
    static fromTriangle(input:Array<Array<number>>,material:number):Array<[number,number,number,number]>{
        const res:Array<[number,number,number,number]> = [];
        for(let i=0;i<input.length;i+=3){
            //primitive is already a list of triangles, just append material
            res.push([i,i+1,i+2,material]);
        }
        return res;
    }
}

const toObj=(models:Array<IModel>)=>{
    //convert to a very basic OBJ file format
    //https://en.wikipedia.org/wiki/Wavefront_.obj_file
    let vertOffset = 1;
    let outputVerts:Array<string> = [];
    let outputFaces:Array<string> = [];
    for(const model of models){
        for(const vert of model.points){
            const x = vert[0];
            const y = vert[1];
            const z = vert[2];
            outputVerts.push(`v ${x} ${y} ${z}\n`);
        }
        for(const face of model.triangles){
            const face0 = face[0]+vertOffset;
            const face1 = face[1]+vertOffset;
            const face2 = face[2]+vertOffset;
            outputFaces.push(`f ${face0} ${face1} ${face2}\n`);
        }
        vertOffset+=model.points.length;
    }
    let obj = '#license:CC BY-NC 4.0\n#verts:\n';
    for(const vert of outputVerts){
        obj+=vert;
    }
    obj+='#faces:\n';
    for(const face of outputFaces){
        obj+=face;
    }
    return obj;
}

//convert OBJ to STL 
//https://products.aspose.app/3d/conversion/obj-to-stl
//https://www.makexyz.com/convert/obj-to-stl
//STL viewer 
//https://ronitsinha.github.io/webgl-stl-viewer/
//https://www.viewstl.com/


export{render}