function normalise(vector) {
    const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
    const normalised = [(vector[0] / length), (vector[1] / length), (vector[2] / length)];
    return normalised;
}
function dotproduct(vector1, vector2) {
    let dotproduct = 0;
    for (let i = 0; i < vector1.length; i++) {
        dotproduct = dotproduct + vector1[i] * vector2[i];
    }
    return dotproduct;
}
function normal(point1, point2, point3) {
    const vectora = [(point1[0] - point2[0]), (point1[1] - point2[1]), (point1[2] - point2[2])];
    const vectorb = [(point3[0] - point2[0]), (point3[1] - point2[1]), (point3[2] - point2[2])];
    const crossproduct = [
        (vectora[1] * vectorb[2] - vectora[2] * vectorb[1]),
        (vectora[2] * vectorb[0] - vectora[0] * vectorb[2]),
        (vectora[0] * vectorb[1] - vectora[1] * vectorb[0])
    ];
    const normal = normalise(crossproduct);
    return normal;
}
function pointmatrix(point, matrix) {
    const newpoint = new Array(point.length);
    for (let p = 0; p < 4; p++) {
        newpoint[p] = dotproduct(matrix[p], point);
    }
    return newpoint;
}
function rotate2d(oldx, oldy, angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const newx = (oldx * cos) - (oldy * sin);
    const newy = (oldy * cos) + (oldx * sin);
    return [newx, newy];
}
function radians(degrees) { return Math.round(degrees / 180 * Math.PI * 100000) / 100000; }
function shade(colour, ambient, lightvector, litecol, intensity, facenormal, greyblend) {
    const rgbcol = [(parseInt(colour[1], 16) / 15), (parseInt(colour[2], 16) / 15), (parseInt(colour[3], 16) / 15)];
    const rgbamb = [(parseInt(ambient[1], 16) / 15), (parseInt(ambient[2], 16) / 15), (parseInt(ambient[3], 16) / 15)];
    const rgblit = [(parseInt(litecol[1], 16) / 15), (parseInt(litecol[2], 16) / 15), (parseInt(litecol[3], 16) / 15)];
    const newcol = new Array(3);
    const lightangle = dotproduct(lightvector, facenormal);
    const grey = rgbcol[0] * 0.299 + rgbcol[1] * 0.587 + rgbcol[2] * 0.114;
    for (let c = 0; c < 3; c++) {
        newcol[c] = (rgbcol[c] * rgbamb[c]);
        if (lightangle > 0) {
            newcol[c] = newcol[c] + (Math.pow((rgbcol[c] * lightangle * rgblit[c] * intensity), 0.45) + 0.06 / 1.06);
        }
        newcol[c] = newcol[c] + Math.pow((grey * (1 - greyblend)), 1.2);
        newcol[c] = Math.round(newcol[c] * 255);
    }
    return 'rgb(' + newcol[0] + ',' + newcol[1] + ',' + newcol[2] + ')';
}
function rotatematrix(matrix, originpoint, rotation) {
    const newmatrix = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1],
    ];
    const rotationradians = new Array(3);
    for (let rotaxis = 0; rotaxis < 3; rotaxis++) {
        rotationradians[rotaxis] = radians(rotation[rotaxis]);
    }
    newmatrix[0][3] = matrix[0][3] - originpoint[0];
    newmatrix[1][3] = matrix[1][3] - originpoint[1];
    newmatrix[2][3] = matrix[2][3] - originpoint[2];
    for (let rotaxis = 0; rotaxis < 3; rotaxis++) {
        const angle = rotationradians[rotaxis];
        const xaxis = ((rotaxis + 1) % 3);
        const yaxis = ((rotaxis + 2) % 3);
        const rotated = rotate2d(newmatrix[xaxis][3], newmatrix[yaxis][3], angle);
        newmatrix[xaxis][3] = rotated[0];
        newmatrix[yaxis][3] = rotated[1];
    }
    newmatrix[0][3] = newmatrix[0][3] + originpoint[0];
    newmatrix[1][3] = newmatrix[1][3] + originpoint[1];
    newmatrix[2][3] = newmatrix[2][3] + originpoint[2];
    for (let mp = 0; mp < 3; mp++) {
        newmatrix[mp][0] = matrix[mp][0] - originpoint[0] + matrix[0][3];
        newmatrix[mp][1] = matrix[mp][1] - originpoint[1] + matrix[1][3];
        newmatrix[mp][2] = matrix[mp][2] - originpoint[2] + matrix[2][3];
        for (let rotaxis = 0; rotaxis < 3; rotaxis++) {
            const angle = rotationradians[rotaxis];
            const xaxis = ((rotaxis + 1) % 3);
            const yaxis = ((rotaxis + 2) % 3);
            const rotated = rotate2d(newmatrix[mp][xaxis], newmatrix[mp][yaxis], angle);
            newmatrix[mp][xaxis] = rotated[0];
            newmatrix[mp][yaxis] = rotated[1];
        }
        newmatrix[mp][0] = newmatrix[mp][0] + originpoint[0] - newmatrix[0][3];
        newmatrix[mp][1] = newmatrix[mp][1] + originpoint[1] - newmatrix[1][3];
        newmatrix[mp][2] = newmatrix[mp][2] + originpoint[2] - newmatrix[2][3];
    }
    return newmatrix;
}
function render(ctx, renderscene) {
    const thecamera = renderscene.camera;
    const camerafov = 36 / thecamera.fov;
    const cameraloc = thecamera.location;
    const camerarot = [(thecamera.rotation[0] - 90), (-thecamera.rotation[1]), (-thecamera.rotation[2])];
    const xres = ctx.canvas.width;
    const yres = ctx.canvas.height;
    let cammatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    cammatrix = rotatematrix(cammatrix, [0, 0, 0], camerarot);
    for (let o = 0; o < renderscene.objects.length; o++) {
        const theobject = renderscene.objects[o];
        const objectloc = theobject.location;
        const objrotation = theobject.rotation;
        const pointnum = theobject.points.length;
        theobject.movedpoints = new Array(pointnum);
        let objmatrix = [
            [1, 0, 0, objectloc[0]],
            [0, 1, 0, objectloc[1]],
            [0, 0, 1, objectloc[2]],
            [0, 0, 0, 1]
        ];
        objmatrix = rotatematrix(objmatrix, objectloc, objrotation);
        objmatrix[0][3] = objmatrix[0][3] - cameraloc[0];
        objmatrix[1][3] = objmatrix[1][3] - cameraloc[1];
        objmatrix[2][3] = objmatrix[2][3] - cameraloc[2];
        for (let p = 0; p < pointnum; p++) {
            const point = theobject.points[p];
            let newpoint = pointmatrix(point, objmatrix);
            newpoint = pointmatrix(newpoint, cammatrix);
            theobject.movedpoints[p] = newpoint;
        }
    }
    for (let o = 0; o < renderscene.objects.length; o++) {
        const theobject = renderscene.objects[o];
        const pointnum = theobject.points.length;
        theobject.screenpoints = new Array(pointnum);
        theobject.pointdist = new Array(pointnum);
        for (let p = 0; p < pointnum; p++) {
            const point = theobject.movedpoints[p];
            const screenx = (0.5 + point[0] / point[1] / camerafov * 1) * xres;
            const screeny = (0.5 - point[2] / point[1] / camerafov * 1) * xres - ((xres - yres) / 2);
            theobject.screenpoints[p] = [screenx, screeny];
            const distance = Math.sqrt(point[0] * point[0] + point[1] * point[1] + point[2] * point[2]);
            theobject.pointdist[p] = distance;
        }
    }
    let tritotal = 0;
    for (let o = 0; o < renderscene.objects.length; o++) {
        const theobject = renderscene.objects[o];
        const trinum = theobject.triangles.length;
        theobject.tridistance = new Array(trinum);
        theobject.tridistancecopy = new Array(trinum);
        for (let t = 0; t < trinum; t++) {
            const distance = (theobject.pointdist[theobject.triangles[t][0]] + theobject.pointdist[theobject.triangles[t][1]] + theobject.pointdist[theobject.triangles[t][2]]) / 3;
            theobject.tridistance[t] = distance;
            theobject.tridistancecopy[t] = distance;
        }
        tritotal = tritotal + trinum;
    }
    renderscene.triorder = new Array(tritotal);
    let furthestindex = [0, 0];
    for (let n = 0; n < tritotal; n++) {
        let furthest = 0;
        for (let o = 0; o < renderscene.objects.length; o++) {
            const theobject = renderscene.objects[o];
            for (let t = 0; t < theobject.triangles.length; t++) {
                if (theobject.tridistance[t] > furthest) {
                    furthest = theobject.tridistance[t] * 1;
                    furthestindex = [o, t];
                }
            }
        }
        renderscene.triorder[n] = furthestindex;
        renderscene.objects[furthestindex[0]].tridistance[furthestindex[1]] = 0;
    }
    const ambientcolour = renderscene.ambient;
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = ambientcolour;
    ctx.fill();
    const lightvector = normalise(renderscene.light.direction);
    const lightcol = renderscene.light.colour;
    const intensity = renderscene.light.intensity;
    for (let t = 0; t < renderscene.triorder.length; t++) {
        const theobject = renderscene.objects[renderscene.triorder[t][0]];
        const triangle = theobject.triangles[renderscene.triorder[t][1]];
        let p1 = theobject.movedpoints[triangle[0]];
        let p2 = theobject.movedpoints[triangle[1]];
        let p3 = theobject.movedpoints[triangle[2]];
        const cameravector = normalise([(p1[0] + p2[0] + p3[0]), (p1[1] + p2[1] + p3[1]), (p1[2] + p2[2] + p3[2])]);
        const ydist = p1[1] + p2[1] + p3[1];
        if (ydist > 7) {
            const trinormal = normal(p1, p2, p3);
            p1 = theobject.screenpoints[triangle[0]];
            p2 = theobject.screenpoints[triangle[1]];
            p3 = theobject.screenpoints[triangle[2]];
            const dotprod = dotproduct(trinormal, cameravector);
            if (theobject.wireframe == true || dotproduct(trinormal, cameravector) > 0) {
                const dotprod = dotproduct(trinormal, [0, 1, 0]);
                const colour = (theobject.wireframe == false ?
                    shade(theobject.materials[triangle[3]], ambientcolour, lightvector, lightcol, intensity, trinormal, dotprod)
                    : theobject.materials[triangle[3]]);
                ctx.beginPath();
                ctx.moveTo(p1[0], p1[1]);
                ctx.lineTo(p2[0], p2[1]);
                ctx.lineTo(p3[0], p3[1]);
                ctx.closePath();
                ctx.strokeStyle = colour;
                ctx.stroke();
                if (theobject.wireframe == false) {
                    ctx.fillStyle = colour;
                    ctx.fill();
                }
            }
        }
    }
}
export { render };
//# sourceMappingURL=js-3d.mjs.map