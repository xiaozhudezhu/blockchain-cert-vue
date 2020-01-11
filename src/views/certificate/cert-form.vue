<template>
    <el-form ref="form" :disabled="mode == 'view'" :model="form" label-width="120px" v-loading="loading" :class="'cert-form-' + mode">
        <el-form-item label="证书类型">
            <el-select v-model="form.certType" placeholder="证书类型" clearable>
                <el-option v-for="item in certTypes" :key="item.tid" :label="item.name" :value="parseInt(item.tid)" />
            </el-select>
        </el-form-item>
        <el-form-item label="证书编号">
            <el-input v-model="form.certNo" placeholder="证书编号" clearable />
        </el-form-item>
        <el-form-item label="证书名称">
            <el-input v-model="form.certName" placeholder="证书名称" clearable />
        </el-form-item>
        <el-form-item label="所有人名称">
            <el-input v-model="form.ownerName" placeholder="所有人名称" />
        </el-form-item>
        <el-form-item label="所有人电话">
            <el-input v-model="form.ownerPhone" placeholder="所有人电话" />
        </el-form-item>
        <el-form-item label="所有人身份证">
            <el-input v-model="form.ownerId" placeholder="所有人身份证" />
        </el-form-item>
        <el-form-item label="证书文件">
            <el-upload
                class="upload-demo"
                :data="uploadData"
                :headers="uploadHeaders"
                :action="uploadUrl"
                :on-preview="onFilePreview"
                :on-remove="onFileRemove"
                :on-success="onUploadSuccess"
                :file-list="files"
                list-type="picture">
                <el-button size="small" type="primary" v-if="mode != 'view'">点击上传</el-button>
                <div slot="tip" class="el-upload__tip" v-if="mode != 'view'">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>
        <el-form-item v-if="mode != 'view'">
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="onCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { getToken } from '../../utils/auth';
import request from '@/utils/request'

  export default {
    name: 'cert-form',
    props: {
        form: {},
        certTypes: Array,
        mode: String
    },
    data() {
        return {
            uploadHeaders: { 'Login-Token': getToken() },
            uploadData: { fileType: 'img' },
            uploadUrl: process.env.VUE_APP_BASE_API + '/file/uploadFile',
            loading: false
        }
    },
    computed: {
        files: function() {
            if(this.form && this.form.files) {
                this.form.files.forEach(file => {
                    file.name = file.name || file.fileName;
                    file.url = process.env.VUE_APP_BASE_API + '/file/getFile?id=' + file.id + '&thumbnail=1';
                });
            }
            return this.form.files;
        }
    },
    methods: {
        onUploadSuccess(res, file, fileList) {
            file.id = res.fileId;
            this.form.files = fileList;
        },
        onFileRemove(file, fileList) {
            this.form.files = fileList;
        },
        onFilePreview(file) {

        },
        onSubmit() {
            this.loading = true;
            request.post('/cert/' + this.mode, this.form).then(res => {
                this.loading = false;
                if(res.status == 'success') {
                    this.$message.success('保存成功');
                    this.$emit('onSubmitSuccess');
                }
            })
            .catch(() => {
                this.loading = false;
            });
        },
        onCancel() {
            this.$emit('onCancel');
        }
    }
  }
</script>
<style>
 .cert-form-view .el-input__inner {
     border: 0 !important;
     cursor: default !important;
     background-color: #FFF !important;
     color: #606266 !important;
 }
  .cert-form-view .el-input__suffix-inner, 
    .cert-form-view .el-upload, 
    .cert-form-view .el-icon-close, 
    .cert-form-view .el-icon-tip {
      display: none !important;
  }
</style>