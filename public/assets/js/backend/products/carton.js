define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'products/carton/index' + location.search,
                    add_url: 'products/carton/add',
                    edit_url: 'products/carton/edit',
                    del_url: 'products/carton/del',
                    multi_url: 'products/carton/multi',
                    table: 'carton',
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
                        {field: 'name', title: __('Name')},
                        {field: 'description', title: __('Description')},
                        {field: 'rate', title: __('Rate')},
                        {field: 'inner_box', title: __('Inner_box')},
                        {field: 'weight', title: __('Weight'), operate:'BETWEEN'},
                        /*{field: 'length', title: __('Length'), operate:'BETWEEN'},
                        {field: 'width', title: __('Width'), operate:'BETWEEN'},
                        {field: 'height', title: __('Height'), operate:'BETWEEN'},*/
                        {field: 'size', title: __('Size'), formatter: function (value, row) {
                                return row['length'] + ' × ' + row['width'] + ' × ' + row['height'];
                            }},
                        {field: 'cost', title: __('Cost'), operate:'BETWEEN', formatter: function (value, row) {
                                return value.toFixed(2);
                            }},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate, buttons: [
                                {
                                    name: 'copy',
                                    title: __('Copy'),
                                    classname: 'btn btn-xs btn-success btn-dialog',
                                    icon: 'fa fa-copy',
                                    url: 'products/carton/copy'
                                }
                            ]}
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
                url: 'products/carton/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'name', title: __('Name'), align: 'left'},
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
                                    url: 'products/carton/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'products/carton/destroy',
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
        copy: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                $("form[role=form]").validator({
                    fields: {
                        "#c-name" : "required;length[~128]",
                        "#c-description" : "required;length[~255]",
                        "#c-rate" : "required;integer(+)",
                        "#c-inner_box" : "required;integer(+0)",
                        "#c-weight" : "required;range(0~99999)",
                        "#c-length" : "required;range(0~9999)",
                        "#c-width" : "required;range(0~9999)",
                        "#c-height" : "required;range(0~9999)",
                        "#c-cost" : "required;range(0~999999)"
                    }
                });
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});