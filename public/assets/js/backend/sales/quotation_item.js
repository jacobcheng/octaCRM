define(['jquery', 'bootstrap', 'backend', 'table', 'form','fast', 'layer'], function ($, undefined, Backend, Table, Form, Fast, Layer) {

    var Controller = {
        /*index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'products/quotation_item/index' + location.search,
                    add_url: 'products/quotation_item/add',
                    edit_url: 'products/quotation_item/edit',
                    del_url: 'products/quotation_item/del',
                    multi_url: 'products/quotation_item/multi',
                    table: 'quotation_item',
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
                        {field: 'quotation_id', title: __('Quotation_id')},
                        {field: 'product_id', title: __('Product_id')},
                        {field: 'accessory_ids', title: __('Accessory_ids')},
                        {field: 'package_id', title: __('Package_id')},
                        {field: 'carton_id', title: __('Carton_id')},
                        {field: 'weight', title: __('Weight'), operate:'BETWEEN'},
                        {field: 'cbm', title: __('Cbm'), operate:'BETWEEN'},
                        {field: 'quantity', title: __('Quantity')},
                        {field: 'profit', title: __('Profit')},
                        {field: 'unit_price', title: __('Unit_price'), operate:'BETWEEN'},
                        {field: 'amount', title: __('Amount'), operate:'BETWEEN'},
                        {field: 'quotation.ref_no', title: __('Quotation.ref_no')},
                        {field: 'product.code', title: __('Product.code')},
                        {field: 'accessory.name', title: __('Accessory.name')},
                        {field: 'package.name', title: __('Package.name')},
                        {field: 'carton.name', title: __('Carton.name')},
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
                url: 'products/quotation_item/recyclebin' + location.search,
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
                                    url: 'products/quotation_item/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'products/quotation_item/destroy',
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
            $("[type='submit']").click(function () {
                var ids = window.location.pathname.split("/");
                var that = this;
                Fast.api.ajax({
                    url : "sales/quotation_item/checkupdate/ids/" + ids[ids.length - 1] + location.search,
                    data: {
                        product:$("#c-product_id").val(),
                        package:$("#c-package_id").val(),
                        carton:$("#c-carton_id").val(),
                        accessory:$("#c-accessory_ids").val()
                    }
                },
                function () {
                    $(that).closest("form").trigger("submit");
                },
                function (data, ret) {
                    Layer.confirm(ret.msg + "有更新，是否需要更新报价内容？",{btn:["更新","维持"]},
                        function (index) {
                            $("#c-unit_price").val("");
                            $(that).closest("form").attr("action","sales/quotation_item/edit/update/true/ids/" + ids[ids.length - 1] + location.search);
                            Layer.close(index);
                            $(that).closest("form").trigger("submit");
                        },
                        function (index) {
                            Layer.close(index);
                            $(that).closest("form").trigger("submit");
                        }
                    );
                    return false;
                });
                return false;
            });

            $(function () {
                Layer.confirm("是否需要清空单价，自动计算单价？", {}, function (index) {
                    $("#c-unit_price, #c-usd_unit_price").val("");
                    Layer.close(index);
                });
            });
        },
        copy: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                $("form[role=form]").validator({
                    fields: {
                        "#c-catalog" : "required",
                        "#c-product_model" : "required",
                        "#c-product_id" : "required",
                        "#c-quantity" : "required;integer(+0);range(0~999999)",
                        "#c-profit" : "required;integer(+0);range(0~999)"
                    }
                });
                Form.api.bindevent($("form[role=form]"));
                $("#c-product_model").data("params", function () {
                    return {custom:{category_id:$("#c-catalog").val()}};
                });
                $("#c-product_id").data("params", function () {
                    return {custom:{model_id:$("#c-product_model").val()}};
                });
                $(".btn-append").on("fa.event.appendfieldlist", function () {
                    Form.events.selectpicker($("form[role=form]"));
                });

                $("#c-catalog").change(function(){
                    if($("#c-product_model").val()){
                        $("#c-product_model").selectPageClear();
                    }
                    if($("#c-product_id").val()){
                        $("#c-product_id").selectPageClear();
                    }
                });

                $("#c-product_model").change(function () {
                    if($("#c-product_id").val()){
                        $("#c-product_id").selectPageClear();
                    }
                });
            }
        }
    };
    return Controller;
});