define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'products/sample/index' + location.search,
                    add_url: 'products/sample/add',
                    edit_url: 'products/sample/edit',
                    del_url: 'products/sample/del',
                    multi_url: 'products/sample/multi',
                    table: 'sample',
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
                        {field: 'ref_no', title: __('Ref_no'), formatter: function (value, row) {
                                return "<span data-toggle='tooltip' title='"+row.requirement+"'>"+value+"</span>";
                            }},
                        {field: 'createtime', title: __('Apply Date')},
                        {field: 'client.short_name', title: __('Client.short_name')},
                        {field: 'requiredate', title: __('Requiredate'), operate:'RANGE', addclass:'datetimerange'},
                        {field: 'estimateddate', title: __('Estimateddate'), operate:'RANGE', addclass:'datetimerange', formatter: function (value, row) {
                                return "<span data-toggle='tooltip' title='"+row.feedback+"'>"+value+"</span>";
                            }},
                        //{field: 'feedback', title: __('Feedback')},
                        {field: 'admin.nickname', title: __('Admin_id')},
                        {field: 'status', title: __('Status'), searchList: {"1":__('Pending'),"2":__('Arranged'),"3":__('Completed'),"4":__('Canceled')}, formatter: Table.api.formatter.status},
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
                url: 'products/sample/recyclebin' + location.search,
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
                                    url: 'products/sample/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'products/sample/destroy',
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