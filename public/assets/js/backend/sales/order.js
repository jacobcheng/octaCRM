define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'adminlte'], function ($, undefined, Backend, Table, Form, Admintlte) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'sales/order/index' + location.search,
                    add_url: 'sales/order/add',
                    edit_url: 'sales/order/edit',
                    del_url: 'sales/order/del',
                    multi_url: 'sales/order/multi',
                    table: 'order',
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
                        /*{field: 'id', title: __('Id')},*/
                        {field: 'ref_no', title: __('Ref_no')},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', formatter: Table.api.formatter.datetime},
                        {field: 'client.short_name', title: __('Client_id')},
                        {field: 'country.country_name', title: __('Country_code')},
                        {field: 'contact.appellation', title: __('Contact_id')},
                        {field: 'currency', title: __('Currency'), searchList: {"USD":__('USD'),"CNY":__('CNY')}, formatter: Table.api.formatter.normal},
                        {field: 'incoterms', title: __('Incoterms'), searchList: {"EXW":__('EXW'),"FCA":__('FCA'),"FAS":__('FAS'),"FOB":__('FOB'),"CFR":__('CFR'),"CIF":__('CIF'),"CPT":__('CPT'),"CIP":__('CIP'),"DAT":__('DAT'),"DAP":__('DAP'),"DDP":__('DDP')}, formatter: Table.api.formatter.normal},
                        {field: 'leadtime', title: __('Leadtime')},
                        {field: 'status', title: __('Status'), searchList: {"10":__('Pending'),"20":__('Processing'),"30":__('Collected'),"40":__('Completed'),"-1":__('Cancel')}, formatter: Table.api.formatter.status, custom: {"10":"gray","20":"info","30":"warning","40":"success","-1":"danger"}},
                        {field: 'admin.nickname', title: __('Admin_id')},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate, buttons: [
                                {
                                    name: 'detail',
                                    title: function (row) {
                                        return row.ref_no + " " + __('Detail');
                                    },
                                    classname: 'btn btn-xs btn-success btn-click',
                                    extend: 'data-toggle="tooltip"',
                                    icon: 'fa fa-list',
                                    click: function (value,row) {
                                        Backend.api.addtabs("sales/order/detail/ids/"+row.id, row.ref_no +' '+ __('Detail'))
                                    }
                                },
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
                url: 'sales/order/recyclebin' + location.search,
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
                                    url: 'sales/order/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'sales/order/destroy',
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
        placeorder: function () {
            Controller.api.bindevent();
        },
        print: function () {
            var type = window.location.pathname.split('/');
            type = type[type.length - 3];
            var ids = window.location.pathname.split("/");
            ids = ids[ids.length - 1];

            var beforePrint = function() {
            };
            var afterPrint = function() {
                parent.Layer.closeAll();
            };
            window.onbeforeprint = beforePrint;
            window.onafterprint = afterPrint;
            window.print();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"), function (data) {
                    Fast.api.close(data);
                });
                $('#c-contact_id').data('params', function () {
                    return {custom:{client_id:$('#c-client_id').val()}};
                });
                $("#c-client_id").change(function () {
                    $("#c-contact_id").selectPageClear();
                });

                $('#c-switch').change(function () {
                    if ($(this).is(':checked')){
                        $('#c-destination,#c-country_code').closest('.form-group').show();
                        $('.sp_container').css('width', '100%');
                    } else {
                        $('#c-destination,#c-country_code').val('').closest('.form-group').hide();
                    }
                });

                $("#c-currency").change(function () {
                    if ($(this).val() === "CNY") {
                        $("#c-switch_tax,#c-switch_tax").closest(".form-group").show();
                        $("#c-rate").val('1').closest(".form-group").hide();
                    } else {
                        $("#c-rate").val('').closest(".form-group").show();
                        $("#c-switch_tax,#c-tax_rate").closest(".form-group").hide();
                        $("#c-switch_tax").attr("checked",false);
                        $("#c-tax_rate").val("");
                    }
                });

                $("#c-switch_tax").change(function () {
                    if ($(this).is(":checked")){
                        $("#c-tax_rate").closest('.form-group').show();
                    } else {
                        $("#c-tax_rate").val('').closest('.form-group').hide();
                    }
                });

                $(function () {
                    if ($('#c-destination').val()) {
                        $('#c-switch').trigger('click');
                    }
                    var terms = $('#c-incoterms').val();
                    if (terms === 'FCA'|| terms === 'FAS'|| terms === 'FOB'|| terms === 'CFR'|| terms === 'CPT') {
                        $("#c-transport,#c-transport_fee").closest('.form-group').show();
                    } else if (terms === 'CIF'|| terms === 'CIP'|| terms === 'DAT'|| terms === 'DPT'|| terms === 'DAP' || terms === 'DDP') {
                        $("#c-transport,#c-transport_fee,#c-insurance").closest('.form-group').show();
                    } else {
                        $("#c-transport").val('').closest('.form-group').hide();
                    }

                    if ($("#c-currency").val() === "CNY") {
                        $("#c-switch_tax").closest(".form-group").show();
                        $("#c-rate").closest(".form-group").hide();
                    }

                    if ($("#c-tax_rate").val() > 0) {
                        $("#c-switch_tax").trigger("click");
                    }
                })
            }
        },
        detail: function () {
            $("#btn-edit").click(function () {
                Fast.api.open("sales/order/edit/ids/" + Config.order.id, __('Edit') +' '+ Config.order.ref_no, {callback: function (data) {
                    }
                })
            });

            $("#btn-receivables").click(function () {
                Fast.api.open("accounting/receivables/add/order_id/" +  Config.order.id, __("Receivables"), function () {
                    parent.location.reload();
                })
            });

            $("#btn-print-ci").click(function () {
                Fast.api.open("sales/order/print/type/ci/ids/" + Config.order.id,'',{area:["90%","90%"]})
            });

            $("#btn-print-pl").click(function () {
                Fast.api.open("sales/order/print/type/pl/ids/" + Config.order.id,'',{area:["90%","90%"]})
            });

            Table.api.init({
                showFooter:true,
                extend: {
                    index_url: 'sales/order_item/index' + location.search,
                    add_url: 'sales/order_item/add/currency/' + Config.order.currency + '/order_id/' + Config.order.id,
                    edit_url: 'sales/order_item/edit/currency/'+ Config.order.currency,
                    del_url: 'sales/order_item/del',
                    multi_url: 'sales/order_item/multi',
                    table: 'order_item',
                }
            });

            var table = $("#table");

            var cny = Config.order.currency === "CNY";
            var usd = !cny;
            var tax = Config.order.tax_rate > 0;
            var view = Config.order.status < 20;

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                showColumns: false,
                showToggle: false,
                showExport: false,
                queryParams: function(params){
                    var filter = JSON.parse(params.filter);
                    var op = JSON.parse(params.op);
                    filter.order_id = Config.order.id;
                    op.order_id = '=';
                    params.filter = JSON.stringify(filter);
                    params.op = JSON.stringify(op);
                    return params;
                },
                columns: [
                    [
                        {checkbox: true},
                        {field: 'product.code', title: __('Product'),footerFormatter: function () {
                                return "Total";
                            }},
                        {field: 'accessory', title: __('Accessory'), formatter: function (value) {
                                if (value.length > 0){
                                    return $.map(value, function(val){
                                        return val['name']
                                    })
                                } else {
                                    return '-';
                                }
                            }},
                        {field: 'package.name', title: __('Package')},
                        {field: 'process', title: __('Process'), formatter: function (value, row) {
                                if (value.length > 0) {
                                    return $.map(value, function(val,key){
                                        return val["process"];
                                    })
                                } else {
                                    return '-';
                                }
                            }},
                        {field: 'ctn', title: __('Carton'), footerFormatter: function (row) {
                                var sum = 0;
                                $.map(row, function(val){
                                    sum += val['ctn'];
                                });
                                return sum;
                            }},
                        {field: 'grossw', title: __('Weight'), operate:'BETWEEN', footerFormatter: function (row) {
                                var sum = 0;
                                $.map(row, function (val) {
                                    sum += val['grossw'];
                                });
                                return sum
                            }},
                        {field: 'cbm', title: __('Cbm'), operate:'BETWEEN', footerFormatter: function (row) {
                                var sum = 0;
                                $.map(row, function (val) {
                                    sum += val['cbm'];
                                });
                                return sum.toFixed(2);
                            }},
                        {field: 'quantity', title: __('Quantity'), footerFormatter: function (row) {
                                var sum = 0;
                                $.map(row, function (val) {
                                    sum += val['quantity'];
                                });
                                //return "<span class='text-center'>"+sum+"</span>";
                                return sum;
                            }},
                        {field: 'profit', title: __('Profit')},
                        {field: 'unit_price', title: __('Unit_price'), operate:'BETWEEN', formatter: function (value, row) {
                                //return "<span data-toggle='tooltip' title='USD "+ (value/Config.quotation.rate).toFixed(2)+"'>"+"￥ "+value.toFixed(2)+"</span>";
                                return "￥ " + value.toFixed(2);
                            },visible: cny},
                        {field: 'usd_unit_price', title: __('Unit_price'), operate: "BETWEEN", formatter: function (value) {
                                return "$ " + value.toFixed(2);
                            },visible: usd},
                        {field: 'amount', title: __('Amount'), operate:'BETWEEN', formatter: function (value, row) {
                                //return "<span data-toggle='tooltip' title='USD "+ (value/Config.quotation.rate).toFixed(2)+"'>"+"￥ "+value.toFixed(2)+"</span>";
                                return "￥ " + value.toFixed(2);
                            }, footerFormatter: function (row) {
                                var sum = 0;
                                $.map(row, function(val){
                                    sum += val['amount'];
                                });
                                //return "<span data-toggle='tooltip' title='USD "+ (sum/Config.quotation.rate).toFixed(2)+"'>"+"￥ "+sum.toFixed(2)+"</span>";
                                return "￥ " + sum.toFixed(2);
                            },visible: !tax&&!usd},
                        {field: 'usd_amount', title: __('Amount'), operate: 'EETWEEN', formatter: function (value) {
                                return "$ " + value.toFixed(2);
                            }, footerFormatter: function (row) {
                                var sum = 0;
                                $.map(row, function (val) {
                                    sum += val['usd_amount'];
                                })
                                return "$ " + sum.toFixed(2);
                            },visible: usd},
                        {field: 'tax_amount', title: __('Tax Included'), formatter: function (value, row) {
                                //var tax_amount = (row['amount']/(1 - Config.quotation.tax_rate/100));
                                //return "<span data-toggle='tooltip' title='"+__('Tax')+": "+ (tax_amount - row['amount']).toFixed(2) +"'>"+"￥ "+tax_amount.toFixed(2)+"</span>";
                                return "￥ " + value.toFixed(2);
                            }, footerFormatter: function (row) {
                                var sum = 0;
                                $.map(row, function (val) {
                                    sum += val['tax_amount'];
                                })
                                return "￥ " + sum.toFixed(2);
                            },visible: tax},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate, visible: view}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        }
    };
    return Controller;
});