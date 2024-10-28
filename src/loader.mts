

import { render } from "./renderer.mjs";

//https://github.com/Ploaj/HSDLib/blob/master/HSDRaw/GX/Enums.cs (MIT)
enum GXAttr {
    GX_VA_PNMTXIDX = 0,    // position/normal matrix index
    GX_VA_TEX0MTXIDX=1,      // texture 0 matrix index
    GX_VA_TEX1MTXIDX=2,      // texture 1 matrix index
    GX_VA_TEX2MTXIDX=3,      // texture 2 matrix index
    GX_VA_TEX3MTXIDX=4,      // texture 3 matrix index
    GX_VA_TEX4MTXIDX=5,      // texture 4 matrix index
    GX_VA_TEX5MTXIDX=6,      // texture 5 matrix index
    GX_VA_TEX6MTXIDX=7,      // texture 6 matrix index
    GX_VA_TEX7MTXIDX=8,      // texture 7 matrix index
    GX_VA_POS      = 9,    // position
    GX_VA_NRM=10,             // normal
    GX_VA_CLR0=11,            // color 0
    GX_VA_CLR1=12,            // color 1
    GX_VA_TEX0=13,            // input texture coordinate 0
    GX_VA_TEX1=14,            // input texture coordinate 1
    GX_VA_TEX2=15,            // input texture coordinate 2
    GX_VA_TEX3=16,            // input texture coordinate 3
    GX_VA_TEX4=17,            // input texture coordinate 4
    GX_VA_TEX5=18,            // input texture coordinate 5
    GX_VA_TEX6=19,            // input texture coordinate 6
    GX_VA_TEX7=20,            // input texture coordinate 7

    GX_POS_MTX_ARRAY=21,      // position matrix array pointer
    GX_NRM_MTX_ARRAY=22,      // normal matrix array pointer
    GX_TEX_MTX_ARRAY=23,      // texture matrix array pointer
    GX_LIGHT_ARRAY=24,        // light parameter array pointer
    GX_VA_NBT=25,             // normal, bi-normal, tangent 
    GX_VA_MAX_ATTR=26,        // maximum number of vertex attributes

    GX_VA_NULL     = 0xff  // NULL attribute (to mark end of lists)
};
enum GXAttrType{
	GX_NONE    = 0,
	GX_DIRECT=1,
	GX_INDEX8=2,
	GX_INDEX16=3
};

//https://github.com/DRGN-DRC/DAT-Texture-Wizard/blob/main/hsdFiles.py (apache 2.0)
/*
# = ---------------------------------------------- = #
#  [   HSD Internal File Structure Base Classes   ]  #
# = ---------------------------------------------- = #
*/

class ImageDataBlock {
    getLength(structDesc:StructObjDesc):number{
        const width = structDesc.fields.Width.value;
        const height = structDesc.fields.Height.value;
        const imageType = structDesc.fields.Image_Type.value;
		const byteMultiplier:Record<number,number> = { //# Defines the bytes required per pixel for each image type.
			0: .5, 1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 4, 8: .5, 9: 1, 10: 2, 14: .5 };
		const blockDimensions:Record<number,[number,number]> = { //# Defines the block width and height for each image type.
			0: [8,8], 1: [8,4], 2: [8,4], 3: [4,4], 4: [4,4], 5: [4,4], 6: [4,4], 8: [8,8], 9: [8,4], 10: [4,4], 14: [8,8] };

		//# Calculate based on all encoded pixels (including those in unused block areas), not just the visible ones of the given dimensions.
		const [blockWidth, blockHeight] = blockDimensions[imageType];
		const trueWidth = Math.ceil( width / blockWidth ) * blockWidth;
		const trueHeight = Math.ceil( height / blockHeight ) * blockHeight;
		return Math.floor( trueWidth * trueHeight * byteMultiplier[imageType] );
    }
    initBlockData(structDesc:StructObjDesc):StructObjDesc{
        const dataLength = this.getLength(structDesc);
        if(dataLength==-1){
            console.warn("!! length-1");
        }
        const res:StructObjDesc={
            fields:{}
        };
        for(let i=0;i<dataLength / 4;i+=1){
            res.fields[''+i]={
                value:0,
                kind:Formatting.I,
            }
        }
       return res;
    }
}
/**
  --------------------------------------------------- =
  [   HSD Internal File Structure Classes  (Common)   ]  
  --------------------------------------------------- = 
 */


enum Formatting{
    q,//? bool (1 byte)
    b,//signed char (1 byte)
    B,//unsigned char (1 byte)
    h,//signed short(2 bytes)
    H,//unsigned short (2 bytes)
    i,//signed int32
    I,//unsigned int32
    f//signed float
}
type childLoader = (loader:Loader,parent:StructObjDesc)=>StructObjDesc;
interface StructObjDesc{
parent?:StructObjDesc;//dynamically added to children, only used to get the transforms for displaylists
fields:Record<string,{value:number,kind:Formatting}>;
childPointers?:Record<string,any>;//given a field on the parent, flag this as a child struct that can be loaded
childLoaders?:Record<string,childLoader>;//given a field on the parent, do a more complex custom loading
}
interface StructObjArrayDesc extends StructObjDesc{
    entryCount:number,
    terminalField:string,
    terminalValue:number
}

class JointObjDesc implements StructObjDesc{

    fields={
        //'>IIIIIfffffffffII'
        'Name_Pointer':{value:0,kind:Formatting.I},
        'Joint_Flags':{value:0,kind:Formatting.I},
        'Child_Pointer':{value:0,kind:Formatting.I},
        'Next_Sibling_Pointer':{value:0,kind:Formatting.I},
        'Display_Object_Pointer':{value:0,kind:Formatting.I},
        'Rotation_X':{value:0,kind:Formatting.f},
        'Rotation_Y':{value:0,kind:Formatting.f},
        'Rotation_Z':{value:0,kind:Formatting.f},
        'Scale_X':{value:0,kind:Formatting.f},
        'Scale_Y':{value:0,kind:Formatting.f},
        'Scale_Z':{value:0,kind:Formatting.f},
        'Translation_X':{value:0,kind:Formatting.f},
        'Translation_Y':{value:0,kind:Formatting.f},
        'Translation_Z':{value:0,kind:Formatting.f},
        'Inverse_Matrix_Pointer':{value:0,kind:Formatting.I},	// Object refers to parent if this is null
        'Reference_Object_Pointer':{value:0,kind:Formatting.I},
    }
    childPointers = {
        'Inverse_Matrix_Pointer': InverseMatrixObjDesc,//load this first because it's needed on children
        'Child_Pointer': JointObjDesc, 'Next_Sibling_Pointer': JointObjDesc, 'Display_Object_Pointer': DisplayObjDesc }


}

class DisplayObjDesc implements StructObjDesc{
    //'>IIII'
    fields={'Name_Pointer':{value:0,kind:Formatting.I},
        'Next_Sibling_Pointer':{value:0,kind:Formatting.I},
        'Material_Object_Pointer':{value:0,kind:Formatting.I},
        'Polygon_Object_Pointer':{value:0,kind:Formatting.I},
    }
    childPointers = { 'Next_Sibling_Pointer': DisplayObjDesc, 'Material_Object_Pointer': MaterialObjDesc, 'Polygon_Object_Pointer': PolygonObjDesc }

}

class InverseMatrixObjDesc implements StructObjDesc{
    //'>ffffffffffff'
		fields = { 
            'M00':{value:0,kind:Formatting.f},
            'M01':{value:0,kind:Formatting.f},
            'M02':{value:0,kind:Formatting.f},
            'M03':{value:0,kind:Formatting.f},
            'M10':{value:0,kind:Formatting.f},
            'M11':{value:0,kind:Formatting.f},
            'M12':{value:0,kind:Formatting.f},
            'M13':{value:0,kind:Formatting.f},
            'M20':{value:0,kind:Formatting.f},
            'M21':{value:0,kind:Formatting.f},
            'M22':{value:0,kind:Formatting.f},
            'M23':{value:0,kind:Formatting.f},
    }
}

class MaterialObjDesc implements StructObjDesc{

    // '>IIIIII'
    fields={ 
        'Name_Pointer':{value:0,kind:Formatting.I},
        'Rendering_Flags':{value:0,kind:Formatting.I},
        'Texture_Object_Pointer':{value:0,kind:Formatting.I},
        'Material_Colors_Pointer':{value:0,kind:Formatting.I},
        'Render_Struct_Pointer':{value:0,kind:Formatting.I},
        'Pixel_Proc._Pointer':{value:0,kind:Formatting.I},
    }
    childPointers = { 'Texture_Object_Pointer': TextureObjDesc, 'Material_Colors_Pointer': MaterialColorObjDesc, 'Pixel_Proc._Pointer': PixelProcObjDesc }

}

class VertexRes{
    pos:[number,number,number]=[0,0,0];//used for triangles, exact format depends on .type field on the container
    nrm:[number,number,number]=[0,0,0];//assigned, but currently unused
    tx0:[number,number]=[0,0];//assigned, but currently unused
}
class VertexContainer{
    type:number;
    verts:Array<VertexRes> = [];
}

class PolygonObjDesc implements StructObjDesc{

                //'>IIIHHII'
    fields={
        'Name_Pointer':{value:0,kind:Formatting.I},
        'Next_Sibling_Pointer':{value:0,kind:Formatting.I},
        'Vertex_Attributes_Array_Pointer':{value:0,kind:Formatting.I},
        'Polygon_Flags':{value:0,kind:Formatting.H},
        'Display_List_Length':{value:0,kind:Formatting.H},	
        'Display_List_Data_Pointer':{value:0,kind:Formatting.I},
        'Weights':{value:0,kind:Formatting.H}//TODO: weight list? bone list? are there other fields in POBJ??
    }
    childPointers = { 'Next_Sibling_Pointer': PolygonObjDesc, 'Vertex_Attributes_Array_Pointer': VertexAttributesArray, };

    childLoaders = {
        'Display_List_Data_Pointer':(loader:Loader,parent:PolygonObjDesc)=>{
            //https://github.com/jam1garner/Smash-Forge/blob/master/Smash%20Forge/Filetypes/Melee/DAT.cs#L1578 (MIT)
            let offset = parent.fields.Display_List_Data_Pointer.value;
            if(offset==0){return;}
            const displayListSize = parent.fields.Display_List_Length.value;
            const displayList = [];

            for (let i = 0; i < displayListSize; i+=1)
            {
                //type of primitive, number of primitives
                const prim = loader.data_getUint8(offset);offset+=1;
                const count = loader.data_getUint16(offset);offset+=2;
                if(prim==0){break;}

                const displayObject = new VertexContainer();
                displayObject.type = prim;//this is: renderer.PRIMITIVE_TYPES

                for(let j=0;j<count;j+=1){
                    const v=new VertexRes();
                    displayObject.verts.push(v);
                    for(const attAny of (parent.fields.Vertex_Attributes_Array_Pointer as any).list){
                        const att = attAny as VertexAttributesArray;
                        if(att.fields.Component_Type.value!=4){//4==float32, other types are seeminly unused
                            console.warn("Attribute type is not float.")
                        }
                        
                        let strideLength = 0;
                        const scale = Math.pow(2, att.fields.Scale.value);
                        switch (att.fields.Attribute_Type.value)
                        {
                            case GXAttrType.GX_DIRECT:
                                if (att.fields.Attribute_Name.value == GXAttr.GX_VA_CLR0){
                                    //colour seems to be unused
                                    console.warn("colour not implement");
                                }
                                strideLength = loader.data_getUint8(offset);offset+=1;
                                break;
                            case GXAttrType.GX_INDEX16:
                                strideLength = loader.data_getInt16(offset);offset+=2;
                                break;
                            case GXAttrType.GX_INDEX8://unused
                            default://GX_NONE
                                console.warn("UNKNOWN attribute type ")
                                break;
                        }
                        //read attrs, don't move offset
                        switch (att.fields.Attribute_Name.value)
                        {
                            case GXAttr.GX_VA_POS:
                                const posOffset=(att.fields.Vertex_Data_Pointer.value + att.fields.Stride.value * strideLength);
                                v.pos[0] = loader.data_getFloat32(posOffset)/scale;
                                v.pos[1] = loader.data_getFloat32(posOffset+4)/scale;
                                v.pos[2] = loader.data_getFloat32(posOffset+8)/scale;
                                //TODO: apply transforms
                                /*NOTE: currently ignoring weights and inverser matrix properties */
                                break;
                            case GXAttr.GX_VA_PNMTXIDX:break;//unused, but safe to ignore for now (A position/normal matrix index, )
                            case GXAttr.GX_VA_NRM://unused by renderer, but useful to have
                                const nrmOffset = (att.fields.Vertex_Data_Pointer.value + att.fields.Stride.value * strideLength);
                                v.nrm[0] = loader.data_getFloat32(nrmOffset)/scale;
                                v.nrm[1] = loader.data_getFloat32(nrmOffset+4)/scale;
                                v.nrm[2] = loader.data_getFloat32(nrmOffset+8)/scale;
                                break;
                            case GXAttr.GX_VA_TEX0://unused by renderer, but useful to have
                                const texOffset = (att.fields.Vertex_Data_Pointer.value + att.fields.Stride.value * strideLength);
                                v.tx0[0] = loader.data_getFloat32(texOffset);
                                v.tx0[1] = loader.data_getFloat32(texOffset+4);
                                break;
                            //seemingly rest of attribute types are unused, ignore for now
                            default:
                                console.warn("UNKNOWN attribute name")
                        }
                    }
                }
                displayList.push(displayObject);
            }
            return {
                fields:{},
                displayList
            } as StructObjDesc;

        }
    };
}

class VertexAttributesArray implements StructObjArrayDesc{
    entryCount: number;//terminated by# Check for a null attribute name (GX_VA_NULL; value of 0xFF)
    terminalField='Attribute_Name';
    terminalValue: number = GXAttr.GX_VA_NULL;
    fields={
        //'IIIIBBHI'// * self.entryCount
        'Attribute_Name':{value:0,kind:Formatting.I},			//# 0x0
        'Attribute_Type':{value:0,kind:Formatting.I},			//# 0x4
        'Component_Count':{value:0,kind:Formatting.I},			//# 0x8
        'Component_Type':{value:0,kind:Formatting.I},			//# 0xC
        'Scale':{value:0,kind:Formatting.B},					//# 0x10
        'Padding':{value:0,kind:Formatting.B},					//# 0x11
        'Stride':{value:0,kind:Formatting.H},					//# 0x12
        'Vertex_Data_Pointer':{value:0,kind:Formatting.I},
        /*//TODO: weight list?*/
    }
    
}

class TextureObjDesc implements StructObjDesc{
    fields={
        //'>IIIIfffffffffII??HIfIIIII'
        'Name_Pointer':{value:0,kind:Formatting.I},
        'Next_Sibling_Pointer':{value:0,kind:Formatting.I},
        'GXTexMapID':{value:0,kind:Formatting.I},
        'GXTexGenSrc':{value:0,kind:Formatting.I}, 		// Coord Gen Source Args
        'Rotation_X':{value:0,kind:Formatting.f},
        'Rotation_Y':{value:0,kind:Formatting.f},
        'Rotation_Z':{value:0,kind:Formatting.f},
        'Scale_X':{value:0,kind:Formatting.f},
        'Scale_Y':{value:0,kind:Formatting.f},
        'Scale_Z':{value:0,kind:Formatting.f},
        'Translation_X':{value:0,kind:Formatting.f},
        'Translation_Y':{value:0,kind:Formatting.f},
        'Translation_Z':{value:0,kind:Formatting.f},
        'GXTexWrapMode_S':{value:0,kind:Formatting.I},
        'GXTexWrapMode_T':{value:0,kind:Formatting.I},
        'Repeat_S':{value:0,kind:Formatting.q},
        'Repeat_T':{value:0,kind:Formatting.q},
        'Padding':{value:0,kind:Formatting.H},
        'Texture_Flags':{value:0,kind:Formatting.I},
        'Blending':{value:0,kind:Formatting.f},
        'GXTexFilter':{value:0,kind:Formatting.I},
        'Image_Header_Pointer':{value:0,kind:Formatting.I},
        'Palette_Header_Pointer':{value:0,kind:Formatting.I},
        'LOD_Struct_Pointer':{value:0,kind:Formatting.I},
        'TEV_Struct_Pointer':{value:0,kind:Formatting.I},
    }
    childPointers = { 'Next_Sibling_Pointer': TextureObjDesc, 
        'Image_Header_Pointer': ImageObjDesc, 
     //TODO:  'Palette_Header_Pointer': PaletteObjDesc, 
        'LOD_Struct_Pointer': LodObjDes, 
        'TEV_Struct_Pointer': TevObjDesc }

}

class MaterialColorObjDesc implements StructObjDesc{
    fields={
        //'>IIIff'
        'RGBA_Diffusion':{value:0,kind:Formatting.I},
        'RGBA_Ambience':{value:0,kind:Formatting.I},
        'RGBA_Specular_Highlights':{value:0,kind:Formatting.I},
        'Transparency_Control':{value:0,kind:Formatting.f},
        'Shininess':{value:0,kind:Formatting.f},
    }
}

class PixelProcObjDesc implements StructObjDesc{
    
    fields={
//'>BBBBBBBBBBBB'
	'Pixel Proc. Flags':{value:0,kind:Formatting.B},		//			(bitflags)
    'Reference Value 0':{value:0,kind:Formatting.B},		//			(ref0)
    'Reference Value 1':{value:0,kind:Formatting.B},		//			(ref1)
    'Destination Alpha':{value:0,kind:Formatting.B},		//			(alpha)
    'Blend Mode Type':{value:0,kind:Formatting.B},			// 0x4		(type)
    'Source Factor':{value:0,kind:Formatting.B},			//			(src_factor )
    'Destination Factor':{value:0,kind:Formatting.B},		//			(dst_factor )
    'Blend Operation':{value:0,kind:Formatting.B},			//			(op)
    'Z Compare Function':{value:0,kind:Formatting.B},		// 0x8		(func)
    'Alpha Compare 0':{value:0,kind:Formatting.B},			//			(comp0)
    'Alpha Operation':{value:0,kind:Formatting.B},			//			(op)
    'Alpha Compare 1':{value:0,kind:Formatting.B},			//			(comp1)
    }
}

class ImageObjDesc implements StructObjDesc{
    fields={
        //'>IHHIIff'
        'Image_Data_Pointer':{value:0,kind:Formatting.I},
        'Width':{value:0,kind:Formatting.H},
        'Height':{value:0,kind:Formatting.H},
        'Image_Type':{value:0,kind:Formatting.I},
        'Mipmap_Flag':{value:0,kind:Formatting.I},
        'MinLOD':{value:0,kind:Formatting.f},
        'MaxLOD':{value:0,kind:Formatting.f},
    }
    childPointers = { 'Image_Data_Pointer': ImageDataBlock }

}
class LodObjDes implements StructObjDesc{
    fields={
        //'>If??HI'
        'Min_Filter':{value:0,kind:Formatting.I},		//# GXTexFilter
        'LOD_Bias':{value:0,kind:Formatting.f},			//# Float
        'Bias_Clamp':{value:0,kind:Formatting.q}, 		//# Bool
        'Edge_LOD_Enable':{value:0,kind:Formatting.q},	//# Bool
        'Padding':{value:0,kind:Formatting.H},			//# 2 bytes
        'Max_Anisotrophy':{value:0,kind:Formatting.I},	//# GXAnisotropy
    }
}



class TevObjDesc implements StructObjDesc{
	// '>????????BBBBBBBBIIII'
	fields = { 'Color_Op':{value:0,kind:Formatting.q},
						'Alpha_Op':{value:0,kind:Formatting.q},
						'Color_Bias':{value:0,kind:Formatting.q},
						'Alpha_Bias':{value:0,kind:Formatting.q},
						'Color_Scale':{value:0,kind:Formatting.q},
						'Alpha_Scale':{value:0,kind:Formatting.q},
						'Color_Clamp':{value:0,kind:Formatting.q},
						'Alpha_Clamp':{value:0,kind:Formatting.q},
						'Color_A':{value:0,kind:Formatting.B},			// 0x8
						'Color_B':{value:0,kind:Formatting.B},
						'Color_C':{value:0,kind:Formatting.B},
						'Color_D':{value:0,kind:Formatting.B},
						'Alpha_A':{value:0,kind:Formatting.B},
						'Alpha_B':{value:0,kind:Formatting.B},
						'Alpha_C':{value:0,kind:Formatting.B},
						'Alpha_D':{value:0,kind:Formatting.B},
						'RGBA_Color_1_(konst)':{value:0,kind:Formatting.I},	// 0x10
						'RGBA_Color_2_(tev0)':{value:0,kind:Formatting.I},
						'RGBA_Color_3_(tev1)':{value:0,kind:Formatting.I},
						'Active':{value:0,kind:Formatting.I},
    }
}


//-----------------------------------------------------------//
//-----------------------------------------------------------//
//-----------------------load DAT here-----------------------//
//-----------------------------------------------------------//
//-----------------------------------------------------------//
//https://github.com/DRGN-DRC/DAT-Texture-Wizard/blob/main/hsdStructures.py (apache 2.0)


interface IRootNode{
    rootOffset0x00:number,
    stringTableOffset0x04:number,
    nodeName:string,
    joint:JointObjDesc
}

class Loader{
    relocOffset:number;
    dataOffset:number;
    rootNodes:Array<IRootNode>;
    loadedNodes:Record<number,StructObjDesc>;
    #data:DataView;
    _mask:Uint8Array;
    constructor(dataOffset:number,relocOffset:number,rootNodes:Array<IRootNode>,data:DataView){
        this.dataOffset = dataOffset;
        this.relocOffset = relocOffset;
        this.rootNodes = rootNodes;
        this.loadedNodes = {};
        this.#data = data;
        this._mask = new Uint8Array(data.byteLength);
    }
    data_getUint8(position:number){
        this._mask[position] = 1;
        return this.#data.getUint8(position+this.dataOffset);
    }
    data_getInt8(position:number){
        this._mask[position] = 1;
        return this.#data.getInt8(position+this.dataOffset);
    }
    data_getUint16(position:number){
        this._mask[position] = 1;
        this._mask[position+1] = 1;
        return this.#data.getUint16(position+this.dataOffset,false);
    }
    data_getInt16(position:number){
        this._mask[position] = 1;
        this._mask[position+1] = 1;
        return this.#data.getInt16(position+this.dataOffset,false);
    }
    data_getUint32(position:number){
        this._mask[position] = 1;
        this._mask[position+1] = 1;
        this._mask[position+2] = 1;
        this._mask[position+3] = 1;
        return this.#data.getUint32(position+this.dataOffset,false);
    }
    data_getFloat32(position:number){
        this._mask[position] = 1;
        this._mask[position+1] = 1;
        this._mask[position+2] = 1;
        this._mask[position+3] = 1;
        return this.#data.getFloat32(position+this.dataOffset,false);
    }
    data_getInt32(position:number){
        this._mask[position] = 1;
        this._mask[position+1] = 1;
        this._mask[position+2] = 1;
        this._mask[position+3] = 1;
        return this.#data.getInt32(position+this.dataOffset,false);
    }
    loadStruct(startOffset:number,structDesc:StructObjDesc){
        let position = startOffset;
        for(const [name,data] of Object.entries(structDesc.fields)){
            //TODO: validation (e.g. check if it's loading an it, it's actually int-like)
            //      could check the mask to see values are not overlapping
            //      could check that ints are in range of file size
            switch(data.kind){
                case Formatting.q://boolean
                case Formatting.B:
                    data.value = this.data_getUint8(position);
                    position+=1;
                    break;
                case Formatting.b:
                    data.value = this.data_getInt8(position);
                    position+=1;
                    break;
                case Formatting.h:
                    data.value = this.data_getInt16(position);
                    position+=2;
                    break;
                case Formatting.H:
                    data.value = this.data_getUint16(position);
                    position+=2;
                    break;
                case Formatting.i:
                    data.value = this.data_getInt32(position);
                    position+=4;
                    break;
                case Formatting.I:
                    data.value = this.data_getUint32(position);
                    position+=4;
                    break;
                case Formatting.f:
                    data.value = this.data_getFloat32(position);
                    position+=4;
                    break;
                    default:console.warn("UNKNOWN FORMAT",data.kind)
            }
        }
    }
    loadPointers(structDesc:StructObjDesc){
        if(structDesc.childPointers){
            for(const [fieldName,className] of Object.entries(structDesc.childPointers)){
                const pointer = structDesc.fields[fieldName].value;
                if(pointer==0){continue;}
                if(this.loadedNodes[pointer]){//if it's already loaded, don't keep searching and cause loops
                    (structDesc.fields[fieldName] as any).pointer = this.loadedNodes[pointer];
                    if(this.loadedNodes[pointer].constructor.name != className.name
                        &&className.name!='ImageDataBlock'//hide warning
                        ){
                        console.warn("trying to load a record of type: "+className.name+" but already have one of type "+this.loadedNodes[pointer].constructor.name)
                    }
                    continue;
                }
                const dest =  new className();
                dest.parent = structDesc;
                (structDesc.fields[fieldName] as any).pointer = dest;
                //if it's a data bloack, load that specifically
                if(dest.constructor.name.indexOf('Block')>-1){
                    //TODO: Currently only image block implemented (it just reads as a chunk of numbers)                
                    const dataStruct = dest.initBlockData(structDesc);
                    this.loadStruct(pointer,dataStruct);
                    this.loadedNodes[pointer] = dataStruct;
                    continue;
                }
                //check if it's an array
                if(dest.terminalField){
                    //the field is an array if it has (terminalField,terminalValue)
                    const list:Array<any> = [];//create an list:[] in that pointer field
                    (structDesc.fields[fieldName] as any).list = list;
                    let arrayPointer =  structDesc.fields[fieldName].value;//jump to pointer offset
                    let breaker = 100000;
                    while(breaker>0){//while (true)
                        breaker-=1;//help detect infinite loops
                        if(breaker<1){console.warn("infinite loop or max breaker size reached");break;}
                        //read struct at offset
                        const arrStructValue = new className();
                        this.loadStruct(arrayPointer,arrStructValue);
                        //if struct.terminalField == terminalValue break;
                        if(arrStructValue.fields[arrStructValue.terminalField].value == arrStructValue.terminalValue){
                            break;
                        }
                        //push struct into parent list[]
                        list.push(arrStructValue);
                        this.loadPointers(arrStructValue);
                        //increment offset TODO: this is already computed in loadStruct...
                        for(const [name,data] of Object.entries((arrStructValue as StructObjDesc).fields)){
                            switch(data.kind){
                                case Formatting.q://boolean
                                case Formatting.B:
                                    arrayPointer+=1;
                                    break;
                                case Formatting.b:
                                    arrayPointer+=1;
                                    break;
                                case Formatting.h:
                                    arrayPointer+=2;
                                    break;
                                case Formatting.H:
                                    arrayPointer+=2;
                                    break;
                                case Formatting.i:
                                    arrayPointer+=4;
                                    break;
                                case Formatting.I:
                                    arrayPointer+=4;
                                    break;
                                case Formatting.f:
                                    arrayPointer+=4;
                                    break;
                                    default:console.warn("UNKNOWN ARRAY JUMP")
                            }
                        }
                    }
                    continue;
                }
                
                //else it's an unloaded struct, try load it
                this.loadedNodes[pointer] = dest;
                this.loadStruct(pointer,dest);
                this.loadPointers(dest);
            }
        }
        //childLoaders
        if(structDesc.childLoaders){
            for(const [fieldName,loaderFunc] of Object.entries(structDesc.childLoaders)){
                const pointer = structDesc.fields[fieldName].value;
                if(pointer==0){continue;}
                const dest = loaderFunc(this,structDesc);
               // console.log("SETTING:",fieldName,dest);
                (structDesc.fields[fieldName] as any).pointer = dest;
                //set as loaded
                this.loadedNodes[pointer] = dest;
                this.loadStruct(pointer,dest);
                this.loadPointers(dest);

            }
        }
    }
    loadRootNodes(){
        
        //load all root values
        for(const node of this.rootNodes){
            if(node.nodeName == 'scene_data\x00'){continue;}//has edge cases on float and next/child skip for now
            //assume root nodes are joints
            const jointNode = new JointObjDesc();
            node.joint = jointNode;
            const offset = node.rootOffset0x00;
            this.loadedNodes[offset] = jointNode;//keep track of all loaded nodes globally
            this.loadStruct(offset,node.joint);
            this.loadPointers(node.joint);
        }
    }
    
}
const init = async (fileName:string)=>{
	const response = await fetch(fileName);
    console.log(fileName)
	const data = new DataView(await response.arrayBuffer());
	const fileSize = data.getInt32(0, false) ;//false is for big endian 
	const fileHeader = {
		fileSize,//XX
		dataBlockSize0x04:data.getInt32(0x04, false),//YY
		relocationTableCount0x08:data.getInt32(0x08, false),//ZZ
		rootCount0x0C:data.getInt32(0x0C, false),//WW
		rootCount0x10:data.getInt32(0x10, false)//should be 0 for all files... if not, there's a 2nd root...
	}
	const dataOffset  = 0x20;
	const relocOffset = dataOffset + fileHeader.dataBlockSize0x04;
	const rootOffset0 = relocOffset + (fileHeader.relocationTableCount0x08 * 4);
	const tableOffset = rootOffset0 + (fileHeader.rootCount0x0C * 8);
	
	console.log(fileHeader,dataOffset,relocOffset,rootOffset0,tableOffset);
	
	if(fileHeader.rootCount0x10!=0){
		console.warn("Second root segement found...");
	}
	const dataBytes = [];
	for(let i=dataOffset;i<relocOffset;i+=1){
		dataBytes.push(data.getUint8(i));
	}
	
	const root0Bytes = [];
	for(let i=rootOffset0;i<tableOffset;i+=1){
		root0Bytes.push(data.getUint8(i));
	}

	const tableBytes = [];
	for(let i=tableOffset;i<fileSize;i+=1){
		tableBytes.push(data.getUint8(i));
	}
	console.log(dataBytes);
	
	
	/*
	struct ROOT_NODE
	{
	uint32 rootOffset0x00        <format = hex>;
	uint32 stringTableOffset0x04 <format = hex>; // offset to name string
	};
	*/
	const rootNodes:Array<IRootNode> = [];
	const p = new DataView(new Uint8Array(root0Bytes).buffer);
	for(let i=0;i<root0Bytes.length;i+=8){
		rootNodes.push({
			rootOffset0x00:p.getInt32(i,false),
			stringTableOffset0x04:p.getInt32(i+0x04,false),
			nodeName:'',
            joint:null
		});
	}
	const strings = [];
	for(let i=0;i<fileHeader.rootCount0x0C-1;i+=1){
		const strStartIdx = rootNodes[i].stringTableOffset0x04;		
		const strEndIdx = rootNodes[i+1].stringTableOffset0x04;
		const subArr = tableBytes.slice(strStartIdx,strEndIdx);
		strings.push(String.fromCharCode(...subArr));
		rootNodes[i].nodeName=strings[i];//push into pairs as well so we can see them side-by-side
	}
	//add last value
	strings.push(String.fromCharCode(...tableBytes.slice(rootNodes[rootNodes.length-1].stringTableOffset0x04)));
	rootNodes[rootNodes.length-1].nodeName=(strings[strings.length-1]);
    const loader = new Loader(dataOffset,relocOffset,rootNodes,data);
	console.log(loader);
    loader.loadRootNodes();    
//--debug, render how much of the file has been processed visually 
/*
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context =canvas.getContext('2d');

const imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
if(canvas.width*canvas.height<loader._mask.length){
    console.log("NEED BIGGER CANVAS!!")
}
for(let i=0;i<loader._mask.length;i+=1){
    if(loader._mask[i]){
        imagedata.data[i*4]=255;
        imagedata.data[i*4+1]=255;
        imagedata.data[i*4+2]=255;
        imagedata.data[i*4+3]=255;
    }else{
        imagedata.data[i*4]=0;
        imagedata.data[i*4+1]=0;
        imagedata.data[i*4+2]=0;
        imagedata.data[i*4+3]=255;
    }

}

//draw extracted file bytes
//strings data
for(let i=rootOffset0;i<tableOffset;i+=1){
    const pos = (i)*4;
    imagedata.data[pos]=0;
    imagedata.data[pos+1]=255;
    imagedata.data[pos+2]=0;
    imagedata.data[pos+3]=255;
}
for(let i=tableOffset;i<fileSize;i+=1){
    const pos = (i)*4;
    imagedata.data[pos]=255;
    imagedata.data[pos+1]=255;
    imagedata.data[pos+2]=0;
    imagedata.data[pos+3]=255;
}

context.putImageData( imagedata,0,0);
*/
//--end render

//3d render
	return render(loader.loadedNodes);
};



export {init};