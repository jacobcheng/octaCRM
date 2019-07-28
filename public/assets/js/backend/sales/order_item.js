define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
            /*index: function () {
                // 初始化表格参数配置
              /*Table.api.init({
                    extend: {
                        index_url: 'sales/order_item/index' + location.search,
                        add_url: 'sales/order_item/add',
                        edit_url: 'sales/order_item/edit',
                        del_url: 'sales/order_item/del',
                        multi_url: 'sales/order_item/multi',
                        table: 'order_item',
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
                            {field: 'order_id', title: __('Order_id')},
                            {field: 'weight', title: __('Weight'), operate:'BETWEEN'},
                            {field: 'cbm', title: __('Cbm'), operate:'BETWEEN'},
                            {field: 'quantity', title: __('Quantity')},
                            {field: 'profit', title: __('Profit')},
                            {field: 'unit_price', title: __('Unit_price'), operate:'BETWEEN'},
                            {field: 'usd_unit_price', title: __('Usd_unit_price'), operate:'BETWEEN'},
                            {field: 'amount', title: __('Amount'), operate:'BETWEEN'},
                            {field: 'usd_amount', title: __('Usd_amount'), operate:'BETWEEN'},
                            {field: 'tax_amount', title: __('Tax_amount'), operate:'BETWEEN'},
                            {field: 'order.ref_no', title: __('Order.ref_no')},
                            {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                        ]
                    ]
                });

                // 为表格绑定事件
                Table.api.bindevent(table);
        },*/
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
                url: 'sales/order_item/recyclebin' + location.search,
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
                                    url: 'sales/order_item/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'sales/order_item/destroy',
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
                $("#c-product_model").data("params", function () {
                    return {custom:{category_id:$("#c-catalog").val()}};
                });
                $("#c-product_id").data("params", function () {
                    return {custom:{model_id:$("#c-product_model").val()}};
                });
            }
        }
    };
    return Controller;
});