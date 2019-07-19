define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            /*Table.api.init({
                extend: {
                    index_url: 'products/product/index' + location.search,
                    add_url: 'products/product/add',
                    edit_url: 'products/product/edit',
                    del_url: 'products/product/del',
                    multi_url: 'products/product/multi',
                    table: 'product',
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
                        {field: 'model_id', title: __('Model_id')},
                        {field: 'code', title: __('Code')},
                        {field: 'description', title: __('Description')},
                        {field: 'description_cn', title: __('Description_cn')},
                        {field: 'unit', title: __('Unit'), searchList: {"PC":__('Pc'),"SET":__('Set'),"BOX":__('Box'),"CARTON":__('Carton'),"G":__('G'),"KG":__('Kg'),"TON":__('Ton'),"CBM":__('Cbm'),"UNIT":__('Unit')}, formatter: Table.api.formatter.normal},
                        {field: 'moq', title: __('Moq')},
                        {field: 'weight', title: __('Weight'), operate:'BETWEEN'},
                        {field: 'length', title: __('Length'), operate:'BETWEEN'},
                        {field: 'width', title: __('Width'), operate:'BETWEEN'},
                        {field: 'height', title: __('Height'), operate:'BETWEEN'},
                        {field: 'package', title: __('Package')},
                        {field: 'pweight', title: __('Pweight'), operate:'BETWEEN'},
                        {field: 'plength', title: __('Plength'), operate:'BETWEEN'},
                        {field: 'pwidth', title: __('Pwidth'), operate:'BETWEEN'},
                        {field: 'pheight', title: __('Pheight'), operate:'BETWEEN'},
                        {field: 'cost', title: __('Cost'), operate:'BETWEEN'},
                        {field: 'productmodel.model', title: __('Productmodel.model')},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);*/
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
                url: 'products/product/recyclebin' + location.search,
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
                                    url: 'products/product/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'products/product/destroy',
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
                        "#c-code" : "required;length[~64]",
                        "#c-description" : "required;length[~64]",
                        "#c-description_cn" : "required;length[~128]",
                        "#c-specification" : "required",
                        "#c-unit" : "required",
                        "#c-moq" : "required;integer(+)",
                        "#c-weight" : "required;range(0~99999)",
                        "#c-length" : "required;range(0~9999)",
                        "#c-width" : "required;range(0~9999)",
                        "#c-height" : "required;range(0~9999)",
                        "#c-package" : "required;length[~64]",
                        "#c-pweight" : "required;range(0~99999)",
                        "#c-plength" : "required;range(0~9999)",
                        "#c-pwidth" : "required;range(0~9999)",
                        "#c-pheight" : "required;range(0~9999)",
                        "#c-cost" : "required;range(0~999999)"
                    }
                });
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});