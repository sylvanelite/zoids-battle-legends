const fileName = "../a01.dat";
const getNumberParts = (x) => {
    var flt = new Float64Array(1), bytes = new Uint8Array(flt.buffer);
    flt[0] = x;
    var sign = bytes[7] >> 7, exponent = ((bytes[7] & 0x7f) << 4 | bytes[6] >> 4) - 0x3ff;
    bytes[7] = 0x3f;
    bytes[6] |= 0xf0;
    return {
        sign: sign,
        exponent: exponent,
        mantissa: flt[0],
    };
};
var GXAttr;
(function (GXAttr) {
    GXAttr[GXAttr["GX_VA_PNMTXIDX"] = 0] = "GX_VA_PNMTXIDX";
    GXAttr[GXAttr["GX_VA_TEX0MTXIDX"] = 1] = "GX_VA_TEX0MTXIDX";
    GXAttr[GXAttr["GX_VA_TEX1MTXIDX"] = 2] = "GX_VA_TEX1MTXIDX";
    GXAttr[GXAttr["GX_VA_TEX2MTXIDX"] = 3] = "GX_VA_TEX2MTXIDX";
    GXAttr[GXAttr["GX_VA_TEX3MTXIDX"] = 4] = "GX_VA_TEX3MTXIDX";
    GXAttr[GXAttr["GX_VA_TEX4MTXIDX"] = 5] = "GX_VA_TEX4MTXIDX";
    GXAttr[GXAttr["GX_VA_TEX5MTXIDX"] = 6] = "GX_VA_TEX5MTXIDX";
    GXAttr[GXAttr["GX_VA_TEX6MTXIDX"] = 7] = "GX_VA_TEX6MTXIDX";
    GXAttr[GXAttr["GX_VA_TEX7MTXIDX"] = 8] = "GX_VA_TEX7MTXIDX";
    GXAttr[GXAttr["GX_VA_POS"] = 9] = "GX_VA_POS";
    GXAttr[GXAttr["GX_VA_NRM"] = 10] = "GX_VA_NRM";
    GXAttr[GXAttr["GX_VA_CLR0"] = 11] = "GX_VA_CLR0";
    GXAttr[GXAttr["GX_VA_CLR1"] = 12] = "GX_VA_CLR1";
    GXAttr[GXAttr["GX_VA_TEX0"] = 13] = "GX_VA_TEX0";
    GXAttr[GXAttr["GX_VA_TEX1"] = 14] = "GX_VA_TEX1";
    GXAttr[GXAttr["GX_VA_TEX2"] = 15] = "GX_VA_TEX2";
    GXAttr[GXAttr["GX_VA_TEX3"] = 16] = "GX_VA_TEX3";
    GXAttr[GXAttr["GX_VA_TEX4"] = 17] = "GX_VA_TEX4";
    GXAttr[GXAttr["GX_VA_TEX5"] = 18] = "GX_VA_TEX5";
    GXAttr[GXAttr["GX_VA_TEX6"] = 19] = "GX_VA_TEX6";
    GXAttr[GXAttr["GX_VA_TEX7"] = 20] = "GX_VA_TEX7";
    GXAttr[GXAttr["GX_POS_MTX_ARRAY"] = 21] = "GX_POS_MTX_ARRAY";
    GXAttr[GXAttr["GX_NRM_MTX_ARRAY"] = 22] = "GX_NRM_MTX_ARRAY";
    GXAttr[GXAttr["GX_TEX_MTX_ARRAY"] = 23] = "GX_TEX_MTX_ARRAY";
    GXAttr[GXAttr["GX_LIGHT_ARRAY"] = 24] = "GX_LIGHT_ARRAY";
    GXAttr[GXAttr["GX_VA_NBT"] = 25] = "GX_VA_NBT";
    GXAttr[GXAttr["GX_VA_MAX_ATTR"] = 26] = "GX_VA_MAX_ATTR";
    GXAttr[GXAttr["GX_VA_NULL"] = 255] = "GX_VA_NULL";
})(GXAttr || (GXAttr = {}));
;
var GXAttrType;
(function (GXAttrType) {
    GXAttrType[GXAttrType["GX_NONE"] = 0] = "GX_NONE";
    GXAttrType[GXAttrType["GX_DIRECT"] = 1] = "GX_DIRECT";
    GXAttrType[GXAttrType["GX_INDEX8"] = 2] = "GX_INDEX8";
    GXAttrType[GXAttrType["GX_INDEX16"] = 3] = "GX_INDEX16";
})(GXAttrType || (GXAttrType = {}));
;
var GXCompCnt;
(function (GXCompCnt) {
    GXCompCnt[GXCompCnt["GX_DEFAULT"] = 0] = "GX_DEFAULT";
})(GXCompCnt || (GXCompCnt = {}));
;
var GXPosCompCnt;
(function (GXPosCompCnt) {
    GXPosCompCnt[GXPosCompCnt["GX_POS_XY"] = 0] = "GX_POS_XY";
    GXPosCompCnt[GXPosCompCnt["GX_POS_XYZ"] = 1] = "GX_POS_XYZ";
})(GXPosCompCnt || (GXPosCompCnt = {}));
;
var GXNrmCompCnt;
(function (GXNrmCompCnt) {
    GXNrmCompCnt[GXNrmCompCnt["GX_NRM_XYZ"] = 0] = "GX_NRM_XYZ";
    GXNrmCompCnt[GXNrmCompCnt["GX_NRM_NBT"] = 1] = "GX_NRM_NBT";
    GXNrmCompCnt[GXNrmCompCnt["GX_NRM_NBT3"] = 2] = "GX_NRM_NBT3";
})(GXNrmCompCnt || (GXNrmCompCnt = {}));
;
var GXClrCompCnt;
(function (GXClrCompCnt) {
    GXClrCompCnt[GXClrCompCnt["GX_CLR_RGB"] = 0] = "GX_CLR_RGB";
    GXClrCompCnt[GXClrCompCnt["GX_CLR_RGBA"] = 1] = "GX_CLR_RGBA";
})(GXClrCompCnt || (GXClrCompCnt = {}));
;
var GXTexCompCnt;
(function (GXTexCompCnt) {
    GXTexCompCnt[GXTexCompCnt["GX_TEX_S"] = 0] = "GX_TEX_S";
    GXTexCompCnt[GXTexCompCnt["GX_TEX_ST"] = 1] = "GX_TEX_ST";
})(GXTexCompCnt || (GXTexCompCnt = {}));
;
var GXCompType;
(function (GXCompType) {
    GXCompType[GXCompType["GX_U8"] = 0] = "GX_U8";
    GXCompType[GXCompType["GX_S8"] = 1] = "GX_S8";
    GXCompType[GXCompType["GX_U16"] = 2] = "GX_U16";
    GXCompType[GXCompType["GX_S16"] = 3] = "GX_S16";
    GXCompType[GXCompType["GX_F32"] = 4] = "GX_F32";
})(GXCompType || (GXCompType = {}));
;
var GXClrCompType;
(function (GXClrCompType) {
    GXClrCompType[GXClrCompType["GX_RGB565"] = 0] = "GX_RGB565";
    GXClrCompType[GXClrCompType["GX_RGB8"] = 1] = "GX_RGB8";
    GXClrCompType[GXClrCompType["GX_RGBX8"] = 2] = "GX_RGBX8";
    GXClrCompType[GXClrCompType["GX_RGBA4"] = 3] = "GX_RGBA4";
    GXClrCompType[GXClrCompType["GX_RGBA6"] = 4] = "GX_RGBA6";
    GXClrCompType[GXClrCompType["GX_RGBA8"] = 5] = "GX_RGBA8";
})(GXClrCompType || (GXClrCompType = {}));
;
var PRIMITIVE_TYPES;
(function (PRIMITIVE_TYPES) {
    PRIMITIVE_TYPES[PRIMITIVE_TYPES["GL_POINTS"] = 184] = "GL_POINTS";
    PRIMITIVE_TYPES[PRIMITIVE_TYPES["GL_LINES"] = 168] = "GL_LINES";
    PRIMITIVE_TYPES[PRIMITIVE_TYPES["GL_LINE_STRIP"] = 176] = "GL_LINE_STRIP";
    PRIMITIVE_TYPES[PRIMITIVE_TYPES["GL_TRIANGLES"] = 144] = "GL_TRIANGLES";
    PRIMITIVE_TYPES[PRIMITIVE_TYPES["GL_TRIANGLE_STRIP"] = 152] = "GL_TRIANGLE_STRIP";
    PRIMITIVE_TYPES[PRIMITIVE_TYPES["GL_TRIANGLE_FAN"] = 160] = "GL_TRIANGLE_FAN";
    PRIMITIVE_TYPES[PRIMITIVE_TYPES["GL_QUADS"] = 128] = "GL_QUADS";
})(PRIMITIVE_TYPES || (PRIMITIVE_TYPES = {}));
;
;
class Loader {
    relocOffset;
    dataOffset;
    rootNodes;
    #data;
    _mask;
    constructor(dataOffset, relocOffset, rootNodes, data) {
        this.dataOffset = dataOffset;
        this.relocOffset = relocOffset;
        this.rootNodes = rootNodes;
        this.#data = data;
        this._mask = new Uint8Array(data.byteLength);
    }
    data_getUint8(position) {
        this._mask[position] = 1;
        return this.#data.getUint8(position);
    }
    data_getUint16(position) {
        this._mask[position] = 1;
        this._mask[position + 1] = 1;
        return this.#data.getUint16(position, false);
    }
    data_getUint32(position) {
        this._mask[position] = 1;
        this._mask[position + 1] = 1;
        this._mask[position + 2] = 1;
        this._mask[position + 3] = 1;
        return this.#data.getUint32(position, false);
    }
    data_getFloat32(position) {
        this._mask[position] = 1;
        this._mask[position + 1] = 1;
        this._mask[position + 2] = 1;
        this._mask[position + 3] = 1;
        return this.#data.getFloat32(position, false);
    }
    data_getInt32(position) {
        this._mask[position] = 1;
        this._mask[position + 1] = 1;
        this._mask[position + 2] = 1;
        this._mask[position + 3] = 1;
        return this.#data.getInt32(position, false);
    }
    isInRootList(val) {
        for (const node of this.rootNodes) {
            if (node.rootOffset0x00 == val) {
                return node.nodeName;
            }
        }
        return '';
    }
    loadRootNodes() {
        for (const node of this.rootNodes) {
            const offset = node.rootOffset0x00 + this.dataOffset;
            const nodeData = {
                unknown0x00: this.data_getInt32(offset),
                flags0x04: this.data_getInt32(offset + 4),
                child0x08: this.data_getInt32(offset + 8),
                next0x0C: this.data_getInt32(offset + 12),
                dobJ0x10: this.data_getInt32(offset + 16),
                rotA0x14: this.data_getFloat32(offset + 20),
                rotB0x18: this.data_getFloat32(offset + 24),
                rotC0x1C: this.data_getFloat32(offset + 28),
                scaleA0x20: this.data_getFloat32(offset + 32),
                scaleB0x24: this.data_getFloat32(offset + 36),
                scaleC0x28: this.data_getFloat32(offset + 40),
                translationA0x2C: this.data_getFloat32(offset + 44),
                translationB0x30: this.data_getFloat32(offset + 48),
                translationC0x34: this.data_getFloat32(offset + 52),
                inverseTransform0x38: this.data_getInt32(offset + 56),
                unknown0x3C: this.data_getInt32(offset + 60),
            };
            node.data = nodeData;
            if (node.nodeName == 'scene_data\x00') {
                continue;
            }
            this.loadNext(nodeData);
            this.loadChild(nodeData);
            this.loadDobJ(nodeData);
            const isFloatRange = (val) => {
                if (val == 0) {
                    return true;
                }
                if (Math.abs(getNumberParts(val).exponent) > 20) {
                    return false;
                }
                return true;
            };
            if (!isFloatRange(nodeData.rotA0x14)) {
                console.warn("rotA", nodeData, nodeData.rotA0x14);
            }
            if (!isFloatRange(nodeData.rotB0x18)) {
                console.warn("rotB", nodeData, nodeData.rotB0x18);
            }
            if (!isFloatRange(nodeData.rotC0x1C)) {
                console.warn("rotC", nodeData, nodeData.rotC0x1C);
            }
            if (!isFloatRange(nodeData.scaleA0x20)) {
                console.warn("scaleA", nodeData, nodeData.scaleA0x20);
            }
            if (!isFloatRange(nodeData.scaleB0x24)) {
                console.warn("scaleB", nodeData, nodeData.scaleB0x24);
            }
            if (!isFloatRange(nodeData.scaleC0x28)) {
                console.warn("scaleC", nodeData, nodeData.scaleC0x28);
            }
            if (!isFloatRange(nodeData.translationA0x2C)) {
                console.warn("translateA", nodeData, nodeData.translationA0x2C);
            }
            if (!isFloatRange(nodeData.translationB0x30)) {
                console.warn("translateB", nodeData, nodeData.translationB0x30);
            }
            if (!isFloatRange(nodeData.translationC0x34)) {
                console.warn("translateC", nodeData, nodeData.translationC0x34);
            }
            const isInBlock = (val) => {
                if (val == 0) {
                    return true;
                }
                if (val > this.#data.byteLength) {
                    return false;
                }
                if (val < this.dataOffset || val > this.relocOffset) {
                    return false;
                }
                return true;
            };
            if (!isInBlock(nodeData.child0x08)) {
                console.warn("child", nodeData, nodeData.child0x08);
            }
            if (!isInBlock(nodeData.next0x0C)) {
                console.warn("child", nodeData, nodeData.next0x0C);
            }
        }
    }
    loadMat(dObj) {
        if (!dObj.mat0x08) {
            console.warn("no mat");
            return;
        }
        const offset = dObj.mat0x08 + this.dataOffset;
    }
    ;
    loadVertexAttributes(mesh) {
        if (!mesh.vertexAttrArray0x08) {
            console.warn("no vertex attributes");
            return;
        }
        const offset = mesh.vertexAttrArray0x08 + this.dataOffset;
        mesh.attrData = [];
        for (let i = 0; i < 10000000; i += 24) {
            const meshAttr = {
                vtxAttr0x00: this.data_getUint32(offset + i),
                vtxAttrType0x04: this.data_getUint32(offset + 4 + i),
                compCnt0x08: this.data_getUint32(offset + 8 + i),
                compType0x0C: this.data_getUint32(offset + 12 + i),
                scale0x10: this.data_getUint8(offset + 16 + i),
                unknown0x11: this.data_getUint8(offset + 17 + i),
                vtxStride0x12: this.data_getUint16(offset + 18 + i),
                dataOffset0x14: this.data_getUint32(offset + 20 + i),
            };
            if (meshAttr.vtxAttr0x00 == GXAttr.GX_VA_NULL) {
                break;
            }
            if (Object.values(GXAttr).indexOf(meshAttr.vtxAttr0x00) == -1) {
                console.warn("unknown attr!!", meshAttr.vtxAttr0x00);
            }
            if (Object.values(GXAttrType).indexOf(meshAttr.vtxAttrType0x04) == -1) {
                console.warn("unknown attr type!!", meshAttr.vtxAttrType0x04);
            }
            if (Object.values(GXCompType).indexOf(meshAttr.compType0x0C) == -1) {
                console.warn("unknown compCnt type!!", meshAttr.compType0x0C);
            }
            if (meshAttr.vtxAttr0x00 == GXAttr.GX_VA_POS) {
                if (Object.values(GXPosCompCnt).indexOf(meshAttr.compCnt0x08) == -1) {
                    console.warn("unknown compCnt type!!", meshAttr.compCnt0x08);
                }
            }
            else {
                console.warn(" compCnt not implemented for this type!!", meshAttr.compCnt0x08);
            }
            if (meshAttr.vtxAttr0x00 != GXAttr.GX_VA_POS) {
                console.warn("TODO:attr is not position", meshAttr.vtxAttr0x00);
            }
            mesh.attrData.push(meshAttr);
        }
    }
    ;
    loadDisplayList(mesh) {
        if (!mesh.displayListOffset0x10) {
            console.warn("no display list");
            return;
        }
        const offset = mesh.displayListOffset0x10 + this.dataOffset;
        mesh.displayList = {
            primitiveFlags0x00: this.data_getUint8(offset),
            indexCount0x01: this.data_getUint16(offset + 1),
        };
        if (Object.values(PRIMITIVE_TYPES).indexOf(mesh.displayList.primitiveFlags0x00) == -1) {
            console.warn("unknown primitive type!!", mesh.displayList.primitiveFlags0x00);
        }
        const indices = Array(mesh.displayList.indexCount0x01);
        let readOffset = offset + 3;
        for (let j = 0; j < mesh.displayList.indexCount0x01; j += 1) {
            const g = {
                Indices: Array(mesh.attrData.length)
            };
            indices[j] = g;
            let i = 0;
            for (const attr of mesh.attrData) {
                if (attr.vtxAttrType0x04 != GXAttrType.GX_INDEX16 ||
                    attr.compCnt0x08 != GXPosCompCnt.GX_POS_XYZ ||
                    attr.compType0x0C != GXCompType.GX_F32) {
                    i += 1;
                    readOffset += 2;
                    continue;
                }
                g.Indices[i] = this.data_getUint16(readOffset);
                readOffset += 2;
                i += 1;
            }
        }
        let verticies = [];
        for (const ig of indices) {
            for (let i = 0; i < mesh.attrData.length; i += 1) {
                let attribute = mesh.attrData[i];
                if (!attribute) {
                    continue;
                }
                let index = ig.Indices[i];
                if (!index) {
                    continue;
                }
                const f = [0, 0, 0, 0];
                const size = attribute.vtxStride0x12;
                let offStride = attribute.vtxStride0x12 * index;
                for (let k = 0; k < size; k += 1) {
                    f[k] = this.data_getFloat32(offStride + (k * 4));
                }
                verticies.push(f);
                if (attribute.scale0x10) {
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                }
            }
        }
        mesh.displayList.verticies = verticies;
        mesh.displayList.indices = indices;
    }
    ;
    loadMesh(dObj) {
        if (!dObj.mesh0x0C) {
            console.warn("no mesh");
            return;
        }
        const offset = dObj.mesh0x0C + this.dataOffset;
        dObj.mesh = {
            unknown0x00: this.data_getInt32(offset),
            nextOffset0x04: this.data_getInt32(offset + 4),
            vertexAttrArray0x08: this.data_getInt32(offset + 8),
            unknownFlags0x0C: this.data_getUint16(offset + 12),
            displayListSize0x0E: this.data_getUint16(offset + 14),
            displayListOffset0x10: this.data_getInt32(offset + 16),
            weightListOffset0x14: this.data_getInt32(offset + 20),
            unknown0x18: this.data_getInt32(offset + 24),
            unknown0x1C: this.data_getInt32(offset + 28),
        };
        console.log(dObj);
        if (dObj.mesh.nextOffset0x04 !== 0) {
            console.log("!!!!!!!TODO: mesh has next()");
            return;
        }
        this.loadVertexAttributes(dObj.mesh);
        this.loadDisplayList(dObj.mesh);
    }
    ;
    loadNext(nodeData) {
        if (!nodeData.next0x0C) {
            return;
        }
        const offset = nodeData.next0x0C + this.dataOffset;
        const rootname = this.isInRootList(nodeData.next0x0C);
        if (rootname) {
            nodeData.nextIsExistingRoot = rootname;
            return;
        }
        if (nodeData.next0x0C > this.relocOffset) {
            console.warn("load next, out of bounds");
            return;
        }
        nodeData.next = {
            unknown0x00: this.data_getInt32(offset),
            flags0x04: this.data_getInt32(offset + 4),
            child0x08: this.data_getInt32(offset + 8),
            next0x0C: this.data_getInt32(offset + 12),
            dobJ0x10: this.data_getInt32(offset + 16),
            rotA0x14: this.data_getFloat32(offset + 20),
            rotB0x18: this.data_getFloat32(offset + 24),
            rotC0x1C: this.data_getFloat32(offset + 28),
            scaleA0x20: this.data_getFloat32(offset + 32),
            scaleB0x24: this.data_getFloat32(offset + 36),
            scaleC0x28: this.data_getFloat32(offset + 40),
            translationA0x2C: this.data_getFloat32(offset + 44),
            translationB0x30: this.data_getFloat32(offset + 48),
            translationC0x34: this.data_getFloat32(offset + 52),
            inverseTransform0x38: this.data_getInt32(offset + 56),
            unknown0x3C: this.data_getInt32(offset + 60)
        };
        this.loadNext(nodeData.next);
        this.loadChild(nodeData.next);
        this.loadDobJ(nodeData.next);
    }
    ;
    loadChild(nodeData) {
        if (!nodeData.child0x08) {
            return;
        }
        const offset = nodeData.child0x08 + this.dataOffset;
        const rootname = this.isInRootList(nodeData.child0x08);
        if (rootname) {
            nodeData.childIsExistingRoot = rootname;
            return;
        }
        if (nodeData.child0x08 > this.relocOffset) {
            console.warn("load child, out of bounds");
            return;
        }
        nodeData.child = {
            unknown0x00: this.data_getInt32(offset),
            flags0x04: this.data_getInt32(offset + 4),
            child0x08: this.data_getInt32(offset + 8),
            next0x0C: this.data_getInt32(offset + 12),
            dobJ0x10: this.data_getInt32(offset + 16),
            rotA0x14: this.data_getFloat32(offset + 20),
            rotB0x18: this.data_getFloat32(offset + 24),
            rotC0x1C: this.data_getFloat32(offset + 28),
            scaleA0x20: this.data_getFloat32(offset + 32),
            scaleB0x24: this.data_getFloat32(offset + 36),
            scaleC0x28: this.data_getFloat32(offset + 40),
            translationA0x2C: this.data_getFloat32(offset + 44),
            translationB0x30: this.data_getFloat32(offset + 48),
            translationC0x34: this.data_getFloat32(offset + 52),
            inverseTransform0x38: this.data_getInt32(offset + 56),
            unknown0x3C: this.data_getInt32(offset + 60),
        };
        this.loadNext(nodeData.child);
        this.loadChild(nodeData.child);
        this.loadDobJ(nodeData.child);
    }
    ;
    loadDobJ(nodeData) {
        if (!nodeData.dobJ0x10) {
            return;
        }
        const offset = nodeData.dobJ0x10 + this.dataOffset;
        nodeData.dobJ = {
            unknown0x00: this.data_getInt32(offset),
            unknown0x04: this.data_getInt32(offset + 4),
            mat0x08: this.data_getInt32(offset + 8),
            mesh0x0C: this.data_getInt32(offset + 12),
            unknown0x10: this.data_getInt32(offset + 16),
            unknown0x14: this.data_getInt32(offset + 20),
            unknown0x18: this.data_getInt32(offset + 24),
            unknown0x1C: this.data_getInt32(offset + 28),
        };
        this.loadMat(nodeData.dobJ);
        this.loadMesh(nodeData.dobJ);
    }
    ;
}
const init = async () => {
    const response = await fetch(fileName);
    const data = new DataView(await response.arrayBuffer());
    const fileSize = data.getInt32(0, false);
    const fileHeader = {
        fileSize,
        dataBlockSize0x04: data.getInt32(0x04, false),
        relocationTableCount0x08: data.getInt32(0x08, false),
        rootCount0x0C: data.getInt32(0x0C, false),
        rootCount0x10: data.getInt32(0x10, false)
    };
    const dataOffset = 0x20;
    const relocOffset = dataOffset + fileHeader.dataBlockSize0x04;
    const rootOffset0 = relocOffset + (fileHeader.relocationTableCount0x08 * 4);
    const tableOffset = rootOffset0 + (fileHeader.rootCount0x0C * 8);
    console.log(fileHeader, dataOffset, relocOffset, rootOffset0, tableOffset);
    if (fileHeader.rootCount0x10 != 0) {
        console.warn("Second root segement found...");
    }
    const dataBytes = [];
    for (let i = dataOffset; i < relocOffset; i += 1) {
        dataBytes.push(data.getUint8(i));
    }
    const root0Bytes = [];
    for (let i = rootOffset0; i < tableOffset; i += 1) {
        root0Bytes.push(data.getUint8(i));
    }
    const tableBytes = [];
    for (let i = tableOffset; i < fileSize; i += 1) {
        tableBytes.push(data.getUint8(i));
    }
    console.log(dataBytes);
    const rootNodes = [];
    const p = new DataView(new Uint8Array(root0Bytes).buffer);
    for (let i = 0; i < root0Bytes.length; i += 8) {
        rootNodes.push({
            rootOffset0x00: p.getInt32(i, false),
            stringTableOffset0x04: p.getInt32(i + 0x04, false),
            nodeName: ''
        });
    }
    const strings = [];
    for (let i = 0; i < fileHeader.rootCount0x0C - 1; i += 1) {
        const strId = rootNodes[i].rootOffset0x00;
        const strStartIdx = rootNodes[i].stringTableOffset0x04;
        const nextId = rootNodes[i + 1].rootOffset0x00;
        const strEndIdx = rootNodes[i + 1].stringTableOffset0x04;
        const subArr = tableBytes.slice(strStartIdx, strEndIdx);
        strings.push(String.fromCharCode(...subArr));
        rootNodes[i].nodeName = strings[i];
    }
    strings.push(String.fromCharCode(...tableBytes.slice(rootNodes[rootNodes.length - 1].stringTableOffset0x04)));
    rootNodes[rootNodes.length - 1].nodeName = (strings[strings.length - 1]);
    console.log(rootNodes);
    const loader = new Loader(dataOffset, relocOffset, rootNodes, data);
    loader.loadRootNodes();
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
    if (canvas.width * canvas.height < loader._mask.length) {
        console.log("NEED BIGGER CANVAS!!");
    }
    for (let i = 0; i < loader._mask.length; i += 1) {
        if (loader._mask[i]) {
            imagedata.data[i * 4] = 255;
            imagedata.data[i * 4 + 1] = 255;
            imagedata.data[i * 4 + 2] = 255;
            imagedata.data[i * 4 + 3] = 255;
        }
        else {
            imagedata.data[i * 4] = 0;
            imagedata.data[i * 4 + 1] = 0;
            imagedata.data[i * 4 + 2] = 0;
            imagedata.data[i * 4 + 3] = 255;
        }
    }
    for (let i = rootOffset0; i < tableOffset; i += 1) {
        const pos = (i) * 4;
        imagedata.data[pos] = 0;
        imagedata.data[pos + 1] = 255;
        imagedata.data[pos + 2] = 0;
        imagedata.data[pos + 3] = 255;
    }
    for (let i = tableOffset; i < fileSize; i += 1) {
        const pos = (i) * 4;
        imagedata.data[pos] = 255;
        imagedata.data[pos + 1] = 255;
        imagedata.data[pos + 2] = 0;
        imagedata.data[pos + 3] = 255;
    }
    context.putImageData(imagedata, 0, 0);
    return {
        raw: data,
        fileHeader,
        rootNodes
    };
};
export { init };
//# sourceMappingURL=main.mjs.map