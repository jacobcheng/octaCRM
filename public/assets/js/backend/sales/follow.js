define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'sales/follow/index' + location.search,
                    add_url: 'sales/follow/add',
                    edit_url: 'sales/follow/edit',
                    del_url: 'sales/follow/del',
                    multi_url: 'sales/follow/multi',
                    table: 'follow',
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
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange'},
                        {field: 'client.short_name', title: __('Client_id')},
                        {field: 'contact.appellation', title: __('Contact_id')},
                        {field: 'channel', title: __('Channel'), searchList: {"email":__('Email'),"telephone":__('Telephone'),"skype":__('Skype'),"wechat":__('Wechat'),"visit":__('Visit'),"SNS":__('Sns')}, formatter: Table.api.formatter.normal},
                        {field: 'nextdate', title: __('Nextdate'), operate:'RANGE', addclass:'datetimerange'},
                        {field: 'quotation.ref_no', title: __('Quotation_id')},
                        {field: 'order.ref_no', title: __('Order_id')},
                        {field: 'admin.nickname', title: __('Admin_id')},
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
                url: 'sales/follow/recyclebin' + location.search,
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
                                    url: 'sales/follow/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'sales/follow/destroy',
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

                $("#c-client_id").on("change", function () {
                    if ($("#c-contact_id").val()) {
                        $("#c-contact_id").selectPageClear();
                    }
                    if ($("#c-quotation_id").val()) {
                        $("#c-quotation_id").selectPageClear();
                    }
                    if ($("#c-order_id").val()) {
                        $("#c-order_id").selectPageClear();
                    }
                });

                $("#c-contact_id").data("params", function () {
                    return {custom:{client_id:$('#c-client_id').val()}}
                });
                $("#c-quotation_id").data("params", function () {
                    return {custom:{client_id:$('#c-client_id').val(),status:["lt","40"]}}
                });
                $("#c-order_id").data("params", function () {
                    return {custom:{client_id:$('#c-client_id').val(),status:["lt","40"]}}
                });
            }
        }
    };
    return Controller;
});