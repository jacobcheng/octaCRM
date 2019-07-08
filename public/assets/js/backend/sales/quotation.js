define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'sales/quotation/index' + location.search,
                    add_url: 'sales/quotation/add',
                    edit_url: 'sales/quotation/edit',
                    del_url: 'sales/quotation/del',
                    multi_url: 'sales/quotation/multi',
                    table: 'quotation',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'ref_no', title: __('Ref_no')},
                        {field: 'po_no', title: __('Po_no')},
                        {field: 'client_id', title: __('Client_id')},
                        {field: 'currency', title: __('Currency'), searchList: {"USD":__('Usd'),"CNY":__('Cny')}, formatter: Table.api.formatter.normal},
                        {field: 'rate', title: __('Rate'), operate:'BETWEEN'},
                        {field: 'incoterms', title: __('Incoterms'), searchList: {"EXW":__('Exw'),"FCA":__('Fca'),"FAS":__('Fas'),"FOB":__('Fob'),"CFR":__('Cfr'),"CIF":__('Cif'),"CPT":__('Cpt'),"CIP":__('Cip'),"DAT":__('Dat'),"DAP":__('Dap'),"DDP":__('Ddp')}, formatter: Table.api.formatter.normal},
                        {field: 'validay', title: __('Validay')},
                        {field: 'leadtime', title: __('Leadtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'transport', title: __('Transport'), searchList: {"Express Service":__('Express service'),"By Sea":__('By sea'),"By Air":__('By air'),"By Train":__('By train'),"By Road":__('By road')}, formatter: Table.api.formatter.normal},
                        {field: 'transport_fee', title: __('Transport_fee'), operate:'BETWEEN'},
                        {field: 'insurance', title: __('Insurance')},
                        {field: 'prepay', title: __('Prepay')},
                        {field: 'admin_id', title: __('Admin_id')},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'user.nickname', title: __('User.nickname')},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        recyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'sales/quotation/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {
                            field: 'deletetime',
                            title: __('Deletetime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'operate',
                            width: '130px',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'sales/quotation/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'sales/quotation/destroy',
                                    refresh: true
                                }
                            ],
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});