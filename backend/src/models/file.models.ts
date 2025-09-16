import mongoose,{Model, Schema, Types} from "mongoose";
import { FileInterface, FileModelType } from "../schemas/file.schemas";
import { formatBytes } from "../utils/formatBytes";
import { UploadSourceEnum } from "../enum/uploadSource.enum";

const fileSchema = new Schema<FileInterface, FileModelType>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    originalName:{
        type:String,
        required:true,
    },
    storageKey:{
        type:String,
        required:true,
        unique:true
    },
    mimeTypes:{
        type:String,
        required:true, 
    },
    size:{
        type:Number,
        required:true,
        min:1
    },
    ext:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    },
    uploadVia:{
        type:String,
        enum: Object.keys(UploadSourceEnum),
        required:true,
    },
},{
    timestamps:true,
    toObject:{
        transform:(doc,ret)=>{
            ret.formattedSize = formatBytes(ret.size);
            return ret;
        }
    },
    toJSON:{
        transform:(doc,ret)=>{
            ret.formattedSize = formatBytes(ret.size);
            return ret;
        }
    }
});

fileSchema.statics.calculateUsage=async function (
    userId: Types.ObjectId,
): Promise<number> {
    const result = await this.aggregate([
        {$match:{userId}},
        {
            $group:{
                _id:null,
                totalSize:{
                    $sum:'$size'
                }
            }
        }
    ])

    return result[0]?.totalSize || 0;
}

fileSchema.index({userId:1});

fileSchema.index({createdAt:-1});

const FileModel=mongoose.model<FileInterface,FileModelType>('File',fileSchema);
export default FileModel;