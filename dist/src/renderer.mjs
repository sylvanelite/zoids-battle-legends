class IDisplayObjeRes {
    type;
    verts = [];
}
const render = (props) => {
    const displayLists = [];
    for (const prop of Object.values(props)) {
        if (prop.displayList) {
            displayLists.push(prop.displayList);
        }
    }
    console.log(displayLists);
    const models = [];
    for (const displayListArrs of displayLists) {
        const displayListArr = displayListArrs;
        if (displayListArr.length == 1 && displayListArr[0].verts.length == 24) {
            console.log("skipping 24 vert");
            continue;
        }
        for (const displayList of displayListArr) {
            const model = renderVerts(displayList);
            if (model) {
                models.push(model);
            }
        }
    }
    return (toObj(models));
};
let materialIdx = 0;
const materials = ['#f71', '#126', '#eb3', '#f71', '#e29', '#1b6', '#2cf', '#c00', '#c80'];
class PRNG {
    static seed(seed) {
        return {
            A: seed,
            B: seed * 10,
            C: seed * 100,
            D: seed * 1000
        };
    }
    static prng(prng) {
        prng.A |= 0;
        prng.B |= 0;
        prng.C |= 0;
        prng.D |= 0;
        const t = prng.A - (prng.B << 23 | prng.B >>> 9) | 0;
        prng.A = prng.B ^ (prng.C << 16 | prng.C >>> 16) | 0;
        prng.B = prng.C + (prng.D << 11 | prng.D >>> 21) | 0;
        prng.B = prng.C + prng.D | 0;
        prng.C = prng.D + t | 0;
        prng.D = prng.A + t | 0;
        return (prng.D >>> 0) / 4294967296;
    }
}
;
const rngInstance = PRNG.seed(42);
const jitter = (points) => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("nojit")) {
        return;
    }
    for (const p of points) {
        const rng = PRNG.prng(rngInstance);
        p[0] *= (rng > 0.5 ? 1.003 : 0.997);
        p[1] *= (rng > 0.5 ? 1.003 : 0.997);
        p[2] *= (rng > 0.5 ? 1.003 : 0.997);
    }
};
const renderVerts = (displayList) => {
    const model = {
        objectname: 'test',
        origin: [0, 0, 0],
        points: [],
        materials,
        triangles: [],
        location: [0, 0, 0],
        rotation: [0, 0, 0],
        wireframe: false,
        pointsize: 1,
        movedpoints: [],
        tridistance: [],
        tridistancecopy: [],
        screenpoints: [],
        pointdist: [],
    };
    const scale = 0.1;
    materialIdx += 1;
    materialIdx = materialIdx % materials.length;
    switch (displayList.type) {
        case PRIMITIVE_TYPES.GL_TRIANGLE_STRIP:
            for (let v = 0; v < displayList.verts.length; v += 1) {
                const A = displayList.verts[v];
                model.points.push([A.pos[0] * scale, A.pos[1] * scale, A.pos[2] * scale, 1]);
            }
            jitter(model.points);
            model.triangles = PrimitiveToTriangles.fromTriangleStrip(model.points, materialIdx);
            return model;
        case PRIMITIVE_TYPES.GL_QUADS:
            for (let v = 0; v < displayList.verts.length; v += 4) {
                const A = displayList.verts[v];
                const B = displayList.verts[v + 1];
                const C = displayList.verts[v + 2];
                const D = displayList.verts[v + 3];
                model.points.push([A.pos[0] * scale, A.pos[1] * scale, A.pos[2] * scale, 1]);
                model.points.push([B.pos[0] * scale, B.pos[1] * scale, B.pos[2] * scale, 1]);
                model.points.push([C.pos[0] * scale, C.pos[1] * scale, C.pos[2] * scale, 1]);
                model.points.push([D.pos[0] * scale, D.pos[1] * scale, D.pos[2] * scale, 1]);
            }
            jitter(model.points);
            model.triangles = PrimitiveToTriangles.fromQuad(model.points, materialIdx);
            return model;
        case PRIMITIVE_TYPES.GL_TRIANGLES:
            for (let v = 0; v < displayList.verts.length; v += 1) {
                const A = displayList.verts[v];
                model.points.push([A.pos[0] * scale, A.pos[1] * scale, A.pos[2] * scale, 1]);
            }
            jitter(model.points);
            model.triangles = PrimitiveToTriangles.fromTriangle(model.points, materialIdx);
            return model;
        default:
            console.warn("unknown primitive type");
    }
    console.log("!!! renderer not implemented:", displayList.type);
    return null;
};
var PRIMITIVE_TYPES;
(function (PRIMITIVE_TYPES) {
    PRIMITIVE_TYPES[PRIMITIVE_TYPES["GL_TRIANGLES"] = 144] = "GL_TRIANGLES";
    PRIMITIVE_TYPES[PRIMITIVE_TYPES["GL_TRIANGLE_STRIP"] = 152] = "GL_TRIANGLE_STRIP";
    PRIMITIVE_TYPES[PRIMITIVE_TYPES["GL_QUADS"] = 128] = "GL_QUADS";
})(PRIMITIVE_TYPES || (PRIMITIVE_TYPES = {}));
;
class PrimitiveToTriangles {
    static fromTriangleStrip(input, material) {
        const res = [];
        for (let i = 0; i < input.length - 2; i += 1) {
            const tri = (i % 2 == 1) ?
                [i, i + 1, i + 2] :
                [i, i + 2, i + 1];
            res.push([...tri, material]);
        }
        return res;
    }
    static fromQuad(input, material) {
        const res = [];
        for (let i = 0; i < input.length; i += 4) {
            res.push([i + 2, i + 1, i, material]);
            res.push([i, i + 3, i + 2, material]);
        }
        return res;
    }
    static fromTriangle(input, material) {
        const res = [];
        for (let i = 0; i < input.length; i += 3) {
            res.push([i, i + 1, i + 2, material]);
        }
        return res;
    }
}
const toObj = (models) => {
    let vertOffset = 1;
    let outputVerts = [];
    let outputFaces = [];
    for (const model of models) {
        for (const vert of model.points) {
            const x = vert[0];
            const y = vert[1];
            const z = vert[2];
            outputVerts.push(`v ${x} ${y} ${z}\n`);
        }
        for (const face of model.triangles) {
            const face0 = face[0] + vertOffset;
            const face1 = face[1] + vertOffset;
            const face2 = face[2] + vertOffset;
            outputFaces.push(`f ${face0} ${face1} ${face2}\n`);
        }
        vertOffset += model.points.length;
    }
    let obj = '#license:CC BY-NC 4.0\n#verts:\n';
    for (const vert of outputVerts) {
        obj += vert;
    }
    obj += '#faces:\n';
    for (const face of outputFaces) {
        obj += face;
    }
    return obj;
};
export { render };
//# sourceMappingURL=renderer.mjs.map