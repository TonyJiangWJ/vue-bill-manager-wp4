<!-- eslint-disable -->
<template>
    <table cellspacing="0" cellpadding="0" border="0" :style="styleObject">
        <colgroup>
            <col v-for="(column, index) in columns" :width="setCellWidth(column)">
        </colgroup>
        <tbody :class="[prefixCls + '-tbody']">
            <template v-for="(row, index) in data">
                <table-tr
                    :row="row"
                    :key="row._rowKey"
                    :prefix-cls="prefixCls"
                    @mouseenter.native.stop="handleMouseIn(row._index)"
                    @mouseleave.native.stop="handleMouseOut(row._index)"
                    @click.native="clickCurrentRow(row._index)"
                    @dblclick.native.stop="dblclickCurrentRow(row._index)">
                    <td v-for="column in columns" :class="alignCls(column, row)" :rowspan="getRowspan(column.key, row._index)" v-show="showTd(column.key, row._index)">
                        <table-cell
                            :fixed="fixed"
                            :prefix-cls="prefixCls"
                            :row="row"
                            :key="column._columnKey"
                            :column="column"
                            :natural-index="index"
                            :index="row._index"
                            :checked="rowChecked(row._index)"
                            :disabled="rowDisabled(row._index)"
                            :expanded="rowExpanded(row._index)"
                        ></table-cell>
                    </td>
                </table-tr>
                <tr v-if="rowExpanded(row._index)" :class="{[prefixCls + '-expanded-hidden']: fixed}">
                    <td :colspan="columns.length" :class="prefixCls + '-expanded-cell'">
                        <Expand :key="row._rowKey" :row="row" :render="expandRender" :index="row._index"></Expand>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
</template>
<script>
/* eslint-disable */
    // todo :key="row"
    import TableTr from './table-tr.vue';
    import TableCell from './cell.vue';
    import Expand from './expand.js';
    import Mixin from './mixin';

    export default {
        name: 'TableBody',
        mixins: [ Mixin ],
        components: { TableCell, Expand, TableTr },
        props: {
            prefixCls: String,
            styleObject: Object,
            columns: Array,
            data: Array,    // rebuildData
            objData: Object,
            columnsWidth: Object,
            rowspanCfg: Array,
            fixed: {
                type: [Boolean, String],
                default: false
            }
        },
        computed: {
            expandRender () {
                let render = function () {
                    return '';
                };
                for (let i = 0; i < this.columns.length; i++) {
                    const column = this.columns[i];
                    if (column.type && column.type === 'expand') {
                        if (column.render) render = column.render;
                    }
                }
                return render;
            },
            rowspanData () {
                if (this.rowspanCfg && this.rowspanCfg.length >= 1) {
                    let spanDataArray = {}
                    for (let cfg of this.rowspanCfg) {
                        if (cfg.key) {
                            let spanInfoArray = []

                            let key = cfg.key
                            let identifyKey = cfg.identifyKey || key
                            let identifyValSet = []
                            let spanCount = 1
                            let lastIdx = -1
                            for (let idx = 0; idx < this.data.length; idx++) {
                                let item = this.data[idx]
                                let {[identifyKey]: value} = item
                                if (identifyValSet.indexOf(value) === -1) {
                                    if (idx !== 0) {
                                        spanInfoArray.push({
                                            idx: lastIdx,
                                            span: spanCount
                                        })
                                    }
                                    lastIdx = idx
                                    spanCount = 1
                                    identifyValSet.push(value)
                                } else {
                                    spanCount++
                                }
                            }
                            if (lastIdx !== -1) {
                                spanInfoArray.push({
                                    idx: lastIdx,
                                    span: spanCount
                                })
                            }
                            spanDataArray[key] = spanInfoArray
                        }
                    }
                    return spanDataArray
                }
            }
        },
        methods: {
            rowChecked (_index) {
                return this.objData[_index] && this.objData[_index]._isChecked;
            },
            rowDisabled(_index){
                return this.objData[_index] && this.objData[_index]._isDisabled;
            },
            rowExpanded(_index){
                return this.objData[_index] && this.objData[_index]._isExpanded;
            },
            handleMouseIn (_index) {
                this.$parent.handleMouseIn(_index);
            },
            handleMouseOut (_index) {
                this.$parent.handleMouseOut(_index);
            },
            clickCurrentRow (_index) {
                this.$parent.clickCurrentRow(_index);
            },
            dblclickCurrentRow (_index) {
                this.$parent.dblclickCurrentRow(_index);
            },
            showTd(columnKey, rowIdx) {
                if (this.rowspanData) {
                    let spanDataArray = this.rowspanData[columnKey]
                    if (spanDataArray) {
                        let rowspanData = spanDataArray.filter(spanData =>
                            spanData.idx === rowIdx
                        )
                        if (rowspanData && rowspanData.length >= 1) {
                            return true
                        } else {
                            return false
                        }
                    }
                }
                return true
            },
            getRowspan (columnKey, rowIdx) {
                if (this.rowspanData) {
                    let spanDataArray = this.rowspanData[columnKey]
                    if (spanDataArray) {
                        let rowspanData = spanDataArray.filter(spanData =>
                            spanData.idx === rowIdx
                        )
                        if (rowspanData && rowspanData.length >= 1) {
                            return rowspanData[0].span
                        }
                    }
                }
            }
        }
    };
</script>
