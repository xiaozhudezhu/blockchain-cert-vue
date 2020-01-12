<template>
    <div>
        <div class="filter-container">
            <el-select v-model="listQuery.certType" placeholder="证书类型" clearable style="width: 90px" class="filter-item">
                <el-option v-for="item in certTypes" :key="item.tid" :label="item.name" :value="item.tid" />
            </el-select>
            <el-input v-model="listQuery.certNo" placeholder="证书编号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.certName" placeholder="证书名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.ownerName" placeholder="所有人名称" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.ownerPhone" placeholder="所有人电话" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.ownerId" placeholder="所有人身份证" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                {{ $t('table.search') }}
            </el-button>
            <el-button v-if="mode == 'my'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
                {{ $t('table.add') }}
            </el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
                {{ $t('table.export') }}
            </el-button>
        </div>
        <el-table
            v-loading="listLoading"
            :data="tableData"
            style="width: 100%">
            <el-table-column
            prop="certType"
            label="证书类型"
            width="100">
                <template slot-scope="scope">
                    {{certTypesMap[scope.row.certType]}}
                </template>
            </el-table-column>
            <el-table-column
            prop="certNo"
            label="证书编号"
            width="120">
            </el-table-column>
            <el-table-column
            prop="certName"
            label="证书名称"
            width="150">
            </el-table-column>
            <el-table-column
            prop="ownerName"
            label="所有人名称"
            width="120">
            </el-table-column>
            <el-table-column
            prop="ownerPhone"
            label="所有人电话"
            width="120">
            </el-table-column>
            <el-table-column
            prop="ownerId"
            label="所有人身份证"
            width="150">
            </el-table-column>
            <el-table-column
            prop="createUserName"
            label="创建人"
            width="150">
            </el-table-column>
            <el-table-column
            prop="createTime"
            label="创建时间"
            width="150">
            </el-table-column>
            <el-table-column
            prop="createTransaction"
            label="交易Hash"
            width="150" show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-link :href="'https://eth.btc.com/txinfo/' + scope.row.createTransaction" type="primary" target="_blank">
                        {{scope.row.createTransaction}}</el-link>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="150">
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="viewRow(scope.row)"
                    type="text"
                    size="small">
                    查看
                    </el-button>
                    <el-button
                    @click.native.prevent="updateRow(scope.row)"
                    type="text"
                    size="small" v-if="mode == 'my'">
                    修改
                    </el-button>
                    <el-button
                    @click.native.prevent="deleteRow(scope.row)"
                    type="text"
                    size="small" v-if="mode == 'my'">
                    删除
                    </el-button>
                </template>
                </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 30px;">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                @current-change="pagerChange">
            </el-pagination>
        </div>
        <el-dialog :title="currentRow.certName" :visible.sync="dialogFormVisible">
            <cert-form :form="currentRow" :certTypes="certTypes" :mode="currentRowMode"
                @onSubmitSuccess="onUpdateSuccess" @onCancel="onUpdateCancel"></cert-form>
        </el-dialog>
    </div>
</template>

<script>
import request from '@/utils/request'
import certForm from './cert-form'
import { getCurrentUser } from '@/utils/auth'

  export default {
    name: 'cert-list',
    components: { certForm },
    props: {
        mode: String
    },
    data() {
      return {
        downloadLoading: false,
        listLoading: false,
        listQuery: {
            pageNum: 1,
            pageSize: 15,
            createUser: this.mode == 'my' ? getCurrentUser().id : null
        },
        certTypes: [],
        certTypesMap: {},
        tableData: [],
        total: 0,
        dialogFormVisible: false,
        currentRow: {},
        currentRowMode: 'update'
      }
    },
    mounted: function() {
        this.getTypes();
    },
    methods: {
        getTypes() {
            request.post('/dic/getTypes').then(res => {
                if(res.status == 'success') {
                    this.certTypes = res.types;
                    this.certTypes.forEach(type => {
                        this.certTypesMap[type.tid] = type.name
                    });
                    this.handleFilter();
                }
            })
        },
        handleFilter() {
            this.listLoading = true;
            request.post('/cert/search', this.listQuery).then(res => {
                this.listLoading = false;
                if(res.status == 'success') {
                    res.rows.forEach((row) => {
                        row.createTransaction = '0x0e9349302cf91d85f66a61b3559f5248e388dd2f65bd1149a7ea6b37d2149d6c'
                    });
                    this.tableData = res.rows;
                    this.total = res.total;
                }
            })
            .catch(() => {
                this.listLoading = false;
            });
        },
        handleCreate() {
            this.currentRow = {};
            this.currentRowMode = 'create';
            this.dialogFormVisible = true;
        },
        handleDownload() {
            this.$message.warning('功能正在开发中')
        },
        pagerChange(pageNum) {
            this.listQuery.pageNum = pageNum;
        },
        viewRow(rowData) {
            this.currentRowMode = 'view'
            this.currentRow = JSON.parse(JSON.stringify(rowData));
            this.dialogFormVisible = true;
        },
        updateRow(rowData) {
            this.currentRowMode = 'update'
            this.currentRow = JSON.parse(JSON.stringify(rowData));
            this.dialogFormVisible = true;
        },
        deleteRow(rowData) {
            this.$confirm('是否确认删除 ' + rowData.certName + '，删除后数据将无法恢复', '删除数据', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                request.post('/cert/delete', rowData).then(res => {
                    this.listLoading = false;
                    if(res.status == 'success') {
                        this.$message.success('删除成功');
                        this.handleFilter();
                    }
                })
                .catch(() => {
                    this.listLoading = false;
                });
            });
        },
        onUpdateSuccess() {
            this.dialogFormVisible = false;
            this.handleFilter();
        },
        onUpdateCancel() {
            this.dialogFormVisible = false;
        }
    }
  }
</script>