/**
 * Dashboard API
 */
import API from '../apis/api';
import C from '../constants';
import CONFIGS from '../../config/configs'

export default class FileUploadAPI extends API {
    constructor(timeout = 2000, path, reqBody, queryParams = null) {
        super('POST', timeout, false, 'MULTIPART');
        this.type = C.FILE_UPLOAD;
        this.path = path;
        this.s3File = {};
        this.body = reqBody;
    }

    toString() {}

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            console.log(res)
            this.s3File = res;
            return true
        }
        return false
    }

    getPayload() {
        return this.s3File;
    }

    getFormData() {
        var data = new FormData();
        data.append("file", this.body);
        data.append("tenantId", 'pb.amritsar');
        data.append("module", 'dashboard');
        data.append("tag", '123452');
        return data;

    }
    getChartKey() {
        return this.codeKey;
    }
    apiEndPoint() {
        return CONFIGS.FILE_UPLOAD
    }

    getHeaders() {
        return {
            headers: {
                "Content-Type": "multipart/form-data",
                "type": "formData",
                "Cache-Control":"no-cache"
            }
        }
    }


}