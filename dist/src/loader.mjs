import { render } from "./renderer.mjs";
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
class ImageDataBlock {
    getLength(structDesc) {
        const width = structDesc.fields.Width.value;
        const height = structDesc.fields.Height.value;
        const imageType = structDesc.fields.Image_Type.value;
        const byteMultiplier = {
            0: .5, 1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 4, 8: .5, 9: 1, 10: 2, 14: .5
        };
        const blockDimensions = {
            0: [8, 8], 1: [8, 4], 2: [8, 4], 3: [4, 4], 4: [4, 4], 5: [4, 4], 6: [4, 4], 8: [8, 8], 9: [8, 4], 10: [4, 4], 14: [8, 8]
        };
        const [blockWidth, blockHeight] = blockDimensions[imageType];
        const trueWidth = Math.ceil(width / blockWidth) * blockWidth;
        const trueHeight = Math.ceil(height / blockHeight) * blockHeight;
        return Math.floor(trueWidth * trueHeight * byteMultiplier[imageType]);
    }
    initBlockData(structDesc) {
        const dataLength = this.getLength(structDesc);
        if (dataLength == -1) {
            console.warn("!! length-1");
        }
        const res = {
            fields: {}
        };
        for (let i = 0; i < dataLength / 4; i += 1) {
            res.fields['' + i] = {
                value: 0,
                kind: Formatting.I,
            };
        }
        return res;
    }
}
var Formatting;
(function (Formatting) {
    Formatting[Formatting["q"] = 0] = "q";
    Formatting[Formatting["b"] = 1] = "b";
    Formatting[Formatting["B"] = 2] = "B";
    Formatting[Formatting["h"] = 3] = "h";
    Formatting[Formatting["H"] = 4] = "H";
    Formatting[Formatting["i"] = 5] = "i";
    Formatting[Formatting["I"] = 6] = "I";
    Formatting[Formatting["f"] = 7] = "f";
})(Formatting || (Formatting = {}));
class JointObjDesc {
    fields = {
        'Name_Pointer': { value: 0, kind: Formatting.I },
        'Joint_Flags': { value: 0, kind: Formatting.I },
        'Child_Pointer': { value: 0, kind: Formatting.I },
        'Next_Sibling_Pointer': { value: 0, kind: Formatting.I },
        'Display_Object_Pointer': { value: 0, kind: Formatting.I },
        'Rotation_X': { value: 0, kind: Formatting.f },
        'Rotation_Y': { value: 0, kind: Formatting.f },
        'Rotation_Z': { value: 0, kind: Formatting.f },
        'Scale_X': { value: 0, kind: Formatting.f },
        'Scale_Y': { value: 0, kind: Formatting.f },
        'Scale_Z': { value: 0, kind: Formatting.f },
        'Translation_X': { value: 0, kind: Formatting.f },
        'Translation_Y': { value: 0, kind: Formatting.f },
        'Translation_Z': { value: 0, kind: Formatting.f },
        'Inverse_Matrix_Pointer': { value: 0, kind: Formatting.I },
        'Reference_Object_Pointer': { value: 0, kind: Formatting.I },
    };
    childPointers = {
        'Inverse_Matrix_Pointer': InverseMatrixObjDesc,
        'Child_Pointer': JointObjDesc, 'Next_Sibling_Pointer': JointObjDesc, 'Display_Object_Pointer': DisplayObjDesc
    };
}
class DisplayObjDesc {
    fields = { 'Name_Pointer': { value: 0, kind: Formatting.I },
        'Next_Sibling_Pointer': { value: 0, kind: Formatting.I },
        'Material_Object_Pointer': { value: 0, kind: Formatting.I },
        'Polygon_Object_Pointer': { value: 0, kind: Formatting.I },
    };
    childPointers = { 'Next_Sibling_Pointer': DisplayObjDesc, 'Material_Object_Pointer': MaterialObjDesc, 'Polygon_Object_Pointer': PolygonObjDesc };
}
class InverseMatrixObjDesc {
    fields = {
        'M00': { value: 0, kind: Formatting.f },
        'M01': { value: 0, kind: Formatting.f },
        'M02': { value: 0, kind: Formatting.f },
        'M03': { value: 0, kind: Formatting.f },
        'M10': { value: 0, kind: Formatting.f },
        'M11': { value: 0, kind: Formatting.f },
        'M12': { value: 0, kind: Formatting.f },
        'M13': { value: 0, kind: Formatting.f },
        'M20': { value: 0, kind: Formatting.f },
        'M21': { value: 0, kind: Formatting.f },
        'M22': { value: 0, kind: Formatting.f },
        'M23': { value: 0, kind: Formatting.f },
    };
}
class MaterialObjDesc {
    fields = {
        'Name_Pointer': { value: 0, kind: Formatting.I },
        'Rendering_Flags': { value: 0, kind: Formatting.I },
        'Texture_Object_Pointer': { value: 0, kind: Formatting.I },
        'Material_Colors_Pointer': { value: 0, kind: Formatting.I },
        'Render_Struct_Pointer': { value: 0, kind: Formatting.I },
        'Pixel_Proc._Pointer': { value: 0, kind: Formatting.I },
    };
    childPointers = { 'Texture_Object_Pointer': TextureObjDesc, 'Material_Colors_Pointer': MaterialColorObjDesc, 'Pixel_Proc._Pointer': PixelProcObjDesc };
}
class VertexRes {
    pos = [0, 0, 0];
    nrm = [0, 0, 0];
    tx0 = [0, 0];
}
class VertexContainer {
    type;
    verts = [];
}
class PolygonObjDesc {
    fields = {
        'Name_Pointer': { value: 0, kind: Formatting.I },
        'Next_Sibling_Pointer': { value: 0, kind: Formatting.I },
        'Vertex_Attributes_Array_Pointer': { value: 0, kind: Formatting.I },
        'Polygon_Flags': { value: 0, kind: Formatting.H },
        'Display_List_Length': { value: 0, kind: Formatting.H },
        'Display_List_Data_Pointer': { value: 0, kind: Formatting.I },
        'Weights': { value: 0, kind: Formatting.H }
    };
    childPointers = { 'Next_Sibling_Pointer': PolygonObjDesc, 'Vertex_Attributes_Array_Pointer': VertexAttributesArray, };
    childLoaders = {
        'Display_List_Data_Pointer': (loader, parent) => {
            let offset = parent.fields.Display_List_Data_Pointer.value;
            if (offset == 0) {
                return;
            }
            const displayListSize = parent.fields.Display_List_Length.value;
            const displayList = [];
            for (let i = 0; i < displayListSize; i += 1) {
                const prim = loader.data_getUint8(offset);
                offset += 1;
                const count = loader.data_getUint16(offset);
                offset += 2;
                if (prim == 0) {
                    break;
                }
                const displayObject = new VertexContainer();
                displayObject.type = prim;
                for (let j = 0; j < count; j += 1) {
                    const v = new VertexRes();
                    displayObject.verts.push(v);
                    for (const attAny of parent.fields.Vertex_Attributes_Array_Pointer.list) {
                        const att = attAny;
                        if (att.fields.Component_Type.value != 4) {
                            console.warn("Attribute type is not float.");
                        }
                        let strideLength = 0;
                        const scale = Math.pow(2, att.fields.Scale.value);
                        switch (att.fields.Attribute_Type.value) {
                            case GXAttrType.GX_DIRECT:
                                if (att.fields.Attribute_Name.value == GXAttr.GX_VA_CLR0) {
                                    console.warn("colour not implement");
                                }
                                strideLength = loader.data_getUint8(offset);
                                offset += 1;
                                break;
                            case GXAttrType.GX_INDEX16:
                                strideLength = loader.data_getInt16(offset);
                                offset += 2;
                                break;
                            case GXAttrType.GX_INDEX8:
                            default:
                                console.warn("UNKNOWN attribute type ");
                                break;
                        }
                        switch (att.fields.Attribute_Name.value) {
                            case GXAttr.GX_VA_POS:
                                const posOffset = (att.fields.Vertex_Data_Pointer.value + att.fields.Stride.value * strideLength);
                                v.pos[0] = loader.data_getFloat32(posOffset) / scale;
                                v.pos[1] = loader.data_getFloat32(posOffset + 4) / scale;
                                v.pos[2] = loader.data_getFloat32(posOffset + 8) / scale;
                                break;
                            case GXAttr.GX_VA_PNMTXIDX: break;
                            case GXAttr.GX_VA_NRM:
                                const nrmOffset = (att.fields.Vertex_Data_Pointer.value + att.fields.Stride.value * strideLength);
                                v.nrm[0] = loader.data_getFloat32(nrmOffset) / scale;
                                v.nrm[1] = loader.data_getFloat32(nrmOffset + 4) / scale;
                                v.nrm[2] = loader.data_getFloat32(nrmOffset + 8) / scale;
                                break;
                            case GXAttr.GX_VA_TEX0:
                                const texOffset = (att.fields.Vertex_Data_Pointer.value + att.fields.Stride.value * strideLength);
                                v.tx0[0] = loader.data_getFloat32(texOffset);
                                v.tx0[1] = loader.data_getFloat32(texOffset + 4);
                                break;
                            default:
                                console.warn("UNKNOWN attribute name");
                        }
                    }
                }
                displayList.push(displayObject);
            }
            return {
                fields: {},
                displayList
            };
        }
    };
}
class VertexAttributesArray {
    entryCount;
    terminalField = 'Attribute_Name';
    terminalValue = GXAttr.GX_VA_NULL;
    fields = {
        'Attribute_Name': { value: 0, kind: Formatting.I },
        'Attribute_Type': { value: 0, kind: Formatting.I },
        'Component_Count': { value: 0, kind: Formatting.I },
        'Component_Type': { value: 0, kind: Formatting.I },
        'Scale': { value: 0, kind: Formatting.B },
        'Padding': { value: 0, kind: Formatting.B },
        'Stride': { value: 0, kind: Formatting.H },
        'Vertex_Data_Pointer': { value: 0, kind: Formatting.I },
    };
}
class TextureObjDesc {
    fields = {
        'Name_Pointer': { value: 0, kind: Formatting.I },
        'Next_Sibling_Pointer': { value: 0, kind: Formatting.I },
        'GXTexMapID': { value: 0, kind: Formatting.I },
        'GXTexGenSrc': { value: 0, kind: Formatting.I },
        'Rotation_X': { value: 0, kind: Formatting.f },
        'Rotation_Y': { value: 0, kind: Formatting.f },
        'Rotation_Z': { value: 0, kind: Formatting.f },
        'Scale_X': { value: 0, kind: Formatting.f },
        'Scale_Y': { value: 0, kind: Formatting.f },
        'Scale_Z': { value: 0, kind: Formatting.f },
        'Translation_X': { value: 0, kind: Formatting.f },
        'Translation_Y': { value: 0, kind: Formatting.f },
        'Translation_Z': { value: 0, kind: Formatting.f },
        'GXTexWrapMode_S': { value: 0, kind: Formatting.I },
        'GXTexWrapMode_T': { value: 0, kind: Formatting.I },
        'Repeat_S': { value: 0, kind: Formatting.q },
        'Repeat_T': { value: 0, kind: Formatting.q },
        'Padding': { value: 0, kind: Formatting.H },
        'Texture_Flags': { value: 0, kind: Formatting.I },
        'Blending': { value: 0, kind: Formatting.f },
        'GXTexFilter': { value: 0, kind: Formatting.I },
        'Image_Header_Pointer': { value: 0, kind: Formatting.I },
        'Palette_Header_Pointer': { value: 0, kind: Formatting.I },
        'LOD_Struct_Pointer': { value: 0, kind: Formatting.I },
        'TEV_Struct_Pointer': { value: 0, kind: Formatting.I },
    };
    childPointers = { 'Next_Sibling_Pointer': TextureObjDesc,
        'Image_Header_Pointer': ImageObjDesc,
        'LOD_Struct_Pointer': LodObjDes,
        'TEV_Struct_Pointer': TevObjDesc };
}
class MaterialColorObjDesc {
    fields = {
        'RGBA_Diffusion': { value: 0, kind: Formatting.I },
        'RGBA_Ambience': { value: 0, kind: Formatting.I },
        'RGBA_Specular_Highlights': { value: 0, kind: Formatting.I },
        'Transparency_Control': { value: 0, kind: Formatting.f },
        'Shininess': { value: 0, kind: Formatting.f },
    };
}
class PixelProcObjDesc {
    fields = {
        'Pixel Proc. Flags': { value: 0, kind: Formatting.B },
        'Reference Value 0': { value: 0, kind: Formatting.B },
        'Reference Value 1': { value: 0, kind: Formatting.B },
        'Destination Alpha': { value: 0, kind: Formatting.B },
        'Blend Mode Type': { value: 0, kind: Formatting.B },
        'Source Factor': { value: 0, kind: Formatting.B },
        'Destination Factor': { value: 0, kind: Formatting.B },
        'Blend Operation': { value: 0, kind: Formatting.B },
        'Z Compare Function': { value: 0, kind: Formatting.B },
        'Alpha Compare 0': { value: 0, kind: Formatting.B },
        'Alpha Operation': { value: 0, kind: Formatting.B },
        'Alpha Compare 1': { value: 0, kind: Formatting.B },
    };
}
class ImageObjDesc {
    fields = {
        'Image_Data_Pointer': { value: 0, kind: Formatting.I },
        'Width': { value: 0, kind: Formatting.H },
        'Height': { value: 0, kind: Formatting.H },
        'Image_Type': { value: 0, kind: Formatting.I },
        'Mipmap_Flag': { value: 0, kind: Formatting.I },
        'MinLOD': { value: 0, kind: Formatting.f },
        'MaxLOD': { value: 0, kind: Formatting.f },
    };
    childPointers = { 'Image_Data_Pointer': ImageDataBlock };
}
class LodObjDes {
    fields = {
        'Min_Filter': { value: 0, kind: Formatting.I },
        'LOD_Bias': { value: 0, kind: Formatting.f },
        'Bias_Clamp': { value: 0, kind: Formatting.q },
        'Edge_LOD_Enable': { value: 0, kind: Formatting.q },
        'Padding': { value: 0, kind: Formatting.H },
        'Max_Anisotrophy': { value: 0, kind: Formatting.I },
    };
}
class TevObjDesc {
    fields = { 'Color_Op': { value: 0, kind: Formatting.q },
        'Alpha_Op': { value: 0, kind: Formatting.q },
        'Color_Bias': { value: 0, kind: Formatting.q },
        'Alpha_Bias': { value: 0, kind: Formatting.q },
        'Color_Scale': { value: 0, kind: Formatting.q },
        'Alpha_Scale': { value: 0, kind: Formatting.q },
        'Color_Clamp': { value: 0, kind: Formatting.q },
        'Alpha_Clamp': { value: 0, kind: Formatting.q },
        'Color_A': { value: 0, kind: Formatting.B },
        'Color_B': { value: 0, kind: Formatting.B },
        'Color_C': { value: 0, kind: Formatting.B },
        'Color_D': { value: 0, kind: Formatting.B },
        'Alpha_A': { value: 0, kind: Formatting.B },
        'Alpha_B': { value: 0, kind: Formatting.B },
        'Alpha_C': { value: 0, kind: Formatting.B },
        'Alpha_D': { value: 0, kind: Formatting.B },
        'RGBA_Color_1_(konst)': { value: 0, kind: Formatting.I },
        'RGBA_Color_2_(tev0)': { value: 0, kind: Formatting.I },
        'RGBA_Color_3_(tev1)': { value: 0, kind: Formatting.I },
        'Active': { value: 0, kind: Formatting.I },
    };
}
class Loader {
    relocOffset;
    dataOffset;
    rootNodes;
    loadedNodes;
    #data;
    _mask;
    constructor(dataOffset, relocOffset, rootNodes, data) {
        this.dataOffset = dataOffset;
        this.relocOffset = relocOffset;
        this.rootNodes = rootNodes;
        this.loadedNodes = {};
        this.#data = data;
        this._mask = new Uint8Array(data.byteLength);
    }
    data_getUint8(position) {
        this._mask[position] = 1;
        return this.#data.getUint8(position + this.dataOffset);
    }
    data_getInt8(position) {
        this._mask[position] = 1;
        return this.#data.getInt8(position + this.dataOffset);
    }
    data_getUint16(position) {
        this._mask[position] = 1;
        this._mask[position + 1] = 1;
        return this.#data.getUint16(position + this.dataOffset, false);
    }
    data_getInt16(position) {
        this._mask[position] = 1;
        this._mask[position + 1] = 1;
        return this.#data.getInt16(position + this.dataOffset, false);
    }
    data_getUint32(position) {
        this._mask[position] = 1;
        this._mask[position + 1] = 1;
        this._mask[position + 2] = 1;
        this._mask[position + 3] = 1;
        return this.#data.getUint32(position + this.dataOffset, false);
    }
    data_getFloat32(position) {
        this._mask[position] = 1;
        this._mask[position + 1] = 1;
        this._mask[position + 2] = 1;
        this._mask[position + 3] = 1;
        return this.#data.getFloat32(position + this.dataOffset, false);
    }
    data_getInt32(position) {
        this._mask[position] = 1;
        this._mask[position + 1] = 1;
        this._mask[position + 2] = 1;
        this._mask[position + 3] = 1;
        return this.#data.getInt32(position + this.dataOffset, false);
    }
    loadStruct(startOffset, structDesc) {
        let position = startOffset;
        for (const [name, data] of Object.entries(structDesc.fields)) {
            switch (data.kind) {
                case Formatting.q:
                case Formatting.B:
                    data.value = this.data_getUint8(position);
                    position += 1;
                    break;
                case Formatting.b:
                    data.value = this.data_getInt8(position);
                    position += 1;
                    break;
                case Formatting.h:
                    data.value = this.data_getInt16(position);
                    position += 2;
                    break;
                case Formatting.H:
                    data.value = this.data_getUint16(position);
                    position += 2;
                    break;
                case Formatting.i:
                    data.value = this.data_getInt32(position);
                    position += 4;
                    break;
                case Formatting.I:
                    data.value = this.data_getUint32(position);
                    position += 4;
                    break;
                case Formatting.f:
                    data.value = this.data_getFloat32(position);
                    position += 4;
                    break;
                default: console.warn("UNKNOWN FORMAT", data.kind);
            }
        }
    }
    loadPointers(structDesc) {
        if (structDesc.childPointers) {
            for (const [fieldName, className] of Object.entries(structDesc.childPointers)) {
                const pointer = structDesc.fields[fieldName].value;
                if (pointer == 0) {
                    continue;
                }
                if (this.loadedNodes[pointer]) {
                    structDesc.fields[fieldName].pointer = this.loadedNodes[pointer];
                    if (this.loadedNodes[pointer].constructor.name != className.name
                        && className.name != 'ImageDataBlock') {
                        console.warn("trying to load a record of type: " + className.name + " but already have one of type " + this.loadedNodes[pointer].constructor.name);
                    }
                    continue;
                }
                const dest = new className();
                dest.parent = structDesc;
                structDesc.fields[fieldName].pointer = dest;
                if (dest.constructor.name.indexOf('Block') > -1) {
                    const dataStruct = dest.initBlockData(structDesc);
                    this.loadStruct(pointer, dataStruct);
                    this.loadedNodes[pointer] = dataStruct;
                    continue;
                }
                if (dest.terminalField) {
                    const list = [];
                    structDesc.fields[fieldName].list = list;
                    let arrayPointer = structDesc.fields[fieldName].value;
                    let breaker = 100000;
                    while (breaker > 0) {
                        breaker -= 1;
                        if (breaker < 1) {
                            console.warn("infinite loop or max breaker size reached");
                            break;
                        }
                        const arrStructValue = new className();
                        this.loadStruct(arrayPointer, arrStructValue);
                        if (arrStructValue.fields[arrStructValue.terminalField].value == arrStructValue.terminalValue) {
                            break;
                        }
                        list.push(arrStructValue);
                        this.loadPointers(arrStructValue);
                        for (const [name, data] of Object.entries(arrStructValue.fields)) {
                            switch (data.kind) {
                                case Formatting.q:
                                case Formatting.B:
                                    arrayPointer += 1;
                                    break;
                                case Formatting.b:
                                    arrayPointer += 1;
                                    break;
                                case Formatting.h:
                                    arrayPointer += 2;
                                    break;
                                case Formatting.H:
                                    arrayPointer += 2;
                                    break;
                                case Formatting.i:
                                    arrayPointer += 4;
                                    break;
                                case Formatting.I:
                                    arrayPointer += 4;
                                    break;
                                case Formatting.f:
                                    arrayPointer += 4;
                                    break;
                                default: console.warn("UNKNOWN ARRAY JUMP");
                            }
                        }
                    }
                    continue;
                }
                this.loadedNodes[pointer] = dest;
                this.loadStruct(pointer, dest);
                this.loadPointers(dest);
            }
        }
        if (structDesc.childLoaders) {
            for (const [fieldName, loaderFunc] of Object.entries(structDesc.childLoaders)) {
                const pointer = structDesc.fields[fieldName].value;
                if (pointer == 0) {
                    continue;
                }
                const dest = loaderFunc(this, structDesc);
                structDesc.fields[fieldName].pointer = dest;
                this.loadedNodes[pointer] = dest;
                this.loadStruct(pointer, dest);
                this.loadPointers(dest);
            }
        }
    }
    loadRootNodes() {
        for (const node of this.rootNodes) {
            if (node.nodeName == 'scene_data\x00') {
                continue;
            }
            const jointNode = new JointObjDesc();
            node.joint = jointNode;
            const offset = node.rootOffset0x00;
            this.loadedNodes[offset] = jointNode;
            this.loadStruct(offset, node.joint);
            this.loadPointers(node.joint);
        }
    }
}
const init = async (fileName) => {
    const response = await fetch(fileName);
    console.log(fileName);
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
            nodeName: '',
            joint: null
        });
    }
    const strings = [];
    for (let i = 0; i < fileHeader.rootCount0x0C - 1; i += 1) {
        const strStartIdx = rootNodes[i].stringTableOffset0x04;
        const strEndIdx = rootNodes[i + 1].stringTableOffset0x04;
        const subArr = tableBytes.slice(strStartIdx, strEndIdx);
        strings.push(String.fromCharCode(...subArr));
        rootNodes[i].nodeName = strings[i];
    }
    strings.push(String.fromCharCode(...tableBytes.slice(rootNodes[rootNodes.length - 1].stringTableOffset0x04)));
    rootNodes[rootNodes.length - 1].nodeName = (strings[strings.length - 1]);
    const loader = new Loader(dataOffset, relocOffset, rootNodes, data);
    console.log(loader);
    loader.loadRootNodes();
    return render(loader.loadedNodes);
};
export { init };
//# sourceMappingURL=loader.mjs.map