<template>
    <div class="app-container" style="text-align: center">
        <el-upload
        class="upload-demo"
        drag
        :headers="uploadHeaders"
        :action="uploadUrl"
        :on-success="onUploadSuccess"
        style="width: 100%">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">证书批量上传，请将ZIP文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
            <el-alert v-if="importSuccessResult != null"
                :title="importSuccessResult"
                type="success">
            </el-alert>
            <el-link type="primary" :href='templateUrl'>点击下载模板</el-link></div>
        </el-upload>
    </div>
    
</template>

<script>
import { getToken } from '../../utils/auth';

export default {
    data() {
        return {
            uploadHeaders: { 'Login-Token': getToken() },
            uploadData: { fileType: 'img' },
            uploadUrl: process.env.VUE_APP_BASE_API + '/cert/batchImport',
            templateUrl: process.env.VUE_APP_BASE_API + '/static/import-template.zip',
            loading: false,
            importSuccessResult: null
        }
    },
    methods: {
        onUploadSuccess(res, file, fileList) {
            this.$message.success('上传成功' + res.certList.length + '个证书信息');
            this.importSuccessResult = '上传成功' + res.certList.length + '个证书信息，请到“我的证书”中查看。'
        },
        onUploadError(res, file, fileList) {
            this.$message.error(res.msg);
        }
    }

}
</script>