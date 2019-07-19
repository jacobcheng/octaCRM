define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'adminlte'], function ($, undefined, Backend, Table, Form, Adminlte) {

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
                rowStyle: rowStyle,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'ref_no', title: __('Ref_no')},
                        {field: 'client.short_name', title: __('Client_id')},
                        {field: 'country.country_name', title: __('Country')},
                        {field: 'contact.appellation', title: __('Contact'), formatter: function (value, row) {
                                var cc_email = row['contact']['cc_email'] ? "?cc="+row['contact']['cc_email'] : '';
                                return "<a href='mailto:"+row['contact']['email']+cc_email+"'>"+value+"</a>";
                            }},
                        {field: 'po_no', title: __('Po_no'), formatter: function (value) {
                                return value ? value  : '-';
                            }},
                        //{field: 'currency', title: __('Currency'), searchList: {"USD":__('USD'),"CNY":__('CNY')}, formatter: Table.api.formatter.normal},
                        {field: 'incoterms', title: __('Incoterms'), searchList: {"EXW":__('EXW'),"FCA":__('FCA'),"FAS":__('FAS'),"FOB":__('FOB'),"CFR":__('CFR'),"CIF":__('CIF'),"CPT":__('CPT'),"CIP":__('CIP'),"DAT":__('DAT'),"DAP":__('DAP'),"DDP":__('DDP')}, formatter: Table.api.formatter.normal},
                        //{field: 'validay', title: __('Validay')},
                        /*{field: 'leadtime', title: __('Leadtime'), operate:'RANGE', addclass:'datetimerange', formatter: function (value, row) {
                                var time = new Date(new Date(row['createtime']).getTime() + value * 24 * 60 * 60 * 1000);
                                var month = time.getMonth() + 1;
                                var day = time.getDate();
                                return time.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? "0" + day : day);
                            }},*/
                        //{field: 'transport', title: __('Transport'), searchList: {"Express Service":__('Express Service'),"By Sea":__('By Sea'),"By Air":__('By Air'),"By Train":__('By Train'),"By Road":__('By Road')}, formatter: Table.api.formatter.normal},
                        {field: 'total_amount', title: __('Total Amount'), formatter: function (value, row) {
                                //return "<span data-toggle='tooltip' title='USD "+ (value/row.rate).toFixed(2)+"'>"+value.toFixed(2)+"</span>";
                                return value.toFixed(2);
                            }},
                        {field: 'admin.nickname', title: __('Admin_id')},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange'},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate, buttons: [
                                {
                                    name: 'Detail',
                                    title: function (row) {
                                        return row.ref_no + __('Detail');
                                    },
                                    classname: 'btn btn-xs btn-success btn-click',
                                    icon: 'fa fa-list',
                                    click: function (value,row) {
                                        Backend.api.addtabs("sales/quotation/detail/ids/"+row.id, row.ref_no +' '+ __('Detail'))
                                    }
                                },
                                {
                                    name: 'Copy',
                                    title: __('Copy'),
                                    classname: 'btn btn-xs btn-success btn-dialog btn-copyone',
                                    icon: 'fa fa-copy',
                                    url: 'sales/quotation/copy/update/false',
                                    confirm: '是否复制该报价？',
                                    callback: function (value) {
                                        Fast.api.addtabs("sales/quotation/detail/ids/"+ value.data.ids, value.data.ref_no + ' ' + __("Detail"))
                                    },
                                    extend: 'data-area=\'["90%","90%"]\'',
                                }
                            ]}
                    ],

                ],
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

            function rowStyle(row) {
                var validay = new Date(new Date(row['createtime']).getTime() + row['validay']*24*60*60*1000);
                if (validay < new Date()) {
                    return {classes:'active'};
                } else {
                    return {dlasses:''}
                }
            }
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
        copy: function () {
            Controller.api.bindevent();
            var ids = window.location.pathname.split('/');
            ids = ids[ids.length - 1];
            $(function () {
                Layer.confirm("是否更新到最新参数价格？", {btn:["更新", "维持"]}, function (index) {
                    $("form").attr("action", "sales/quotation/copy/update/true/ids/" + ids + location.search);
                    $("[name*='unit_price'],[name*='usd_unit_price']").val('');
                    Layer.close(index);
                })
            });

            $(".btn-remove").click(function () {
                this.closest(".attachment-block").remove();
            })
        },
        print: function () {
           var type = window.location.pathname.split('/');
           type = type[type.length - 3];
            var ids = window.location.pathname.split("/");
            ids = ids[ids.length - 1];
           if (type === "bank") {
               Controller.api.bindevent();
               $("form").attr("action", "sales/quotation/edit/ids/" + ids);
               $("[id!='c-bank']").closest(".form-group").hide();
               $("#c-bank").closest(".form-group").show();
           } else {
                var beforePrint = function() {
                };
                var afterPrint = function() {
                    parent.Layer.closeAll();
                };
                window.onbeforeprint = beforePrint;
                window.onafterprint = afterPrint;
                window.print();
           }
        },
        api: {
            bindevent: function () {
                $("form[role=form]").validator({
                    ignore: ":hidden",
                    fields: {
                        "#c-po_no" : "length[~16]",
                        "#c-client_id" : "required",
                        "#c-contact_id" : "required",
                        "#c-country_code" : "required(#c-switch:checked)",
                        "#c-destination" : "required(#c-switch:checked)",
                        "#c-tax_rate" : "required(#c-switch_tax:checked);integer(+)",
                        "#c-validay" : "required;integer(+);range(1~365)",
                        "#c-leadtime" : "required;integer(+);range(1~365)",
                        "#c-prepay" : "integer(+);range(10~100)",
                        "#c-transport" : "required",
                        "#c-transport_fee" : "range(0~999999)"
                    }
                });
                Form.api.bindevent($("form[role=form]"), function (data,ret) {
                    Fast.api.close(ret);
                });
                $(".btn-append").on('fa.event.appendfieldlist', function () {
                    Form.events.selectpicker($("form[role=form]"));
                });

                //控制客户和联系人
                $('#c-contact_id').data('params', function () {
                    return {custom:{client_id:$('#c-client_id').val()}};
                });
                $("#c-client_id").change(function () {
                    $("#c-contact_id").selectPageClear();
                });

                //控制是否使用第三方目的地
                $('#c-switch').change(function () {
                    if ($(this).is(':checked')){
                        $('#c-destination,#c-country_code').closest('.form-group').show();
                        $('.sp_container').css('width', '100%');
                    } else {
                        $('#c-destination,#c-country_code').val('').closest('.form-group').hide();
                    }
                });

                //根据币种控制汇率税率显示
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

                //控制显示税率控件
                $("#c-switch_tax").change(function () {
                    if ($(this).is(":checked")){
                        $("#c-tax_rate").closest('.form-group').show();
                    } else {
                        $("#c-tax_rate").val('').closest('.form-group').hide();
                    }
                });

                //根据贸易术语控制运输方式，运费，保险税率显示
                $('#c-incoterms').change(function () {
                    var terms = $(this).val();
                    if (terms === 'FCA'|| terms === 'FAS'|| terms === 'FOB'|| terms === 'CFR'|| terms === 'CPT') {
                        $("#c-transport,#c-transport_fee").closest('.form-group').show();
                        $('#c-insurance').val('').closest('.form-group').hide();
                    } else if (terms === 'CIF'|| terms === 'CIP'|| terms === 'DAT'|| terms === 'DPT'|| terms === 'DAP' || terms === 'DDP') {
                        $("#c-transport,#c-transport_fee,#c-insurance").closest('.form-group').show();
                    } else  {
                        $("#c-transport,#c-transport_fee,#c-insurance").val('').closest('.form-group').hide();
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
                        return;
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
            $(".btn-edit").click(function () {
                Fast.api.open("sales/quotation/edit/ids/" + Config.quotation.id, __('Edit') +' '+ Config.quotation.ref_no, {callback: function (data) {
                    Layer.confirm("是否自动更新该报价下item的价格",{},function (index) {
                        Fast.api.ajax("sales/quotation/updateitems/ids/"+Config.quotation.id, function () {
                            Layer.close(index);
                            window.location.reload();
                        })
                    });
                    }
                })
            });

            $(".btn-print").click(function () {
                Fast.api.open("sales/quotation/print/type/quotation/ids/" + Config.quotation.id,'',{area:["90%","90%"]})
            });

            $(".btn-print-pi").click(function () {
                Fast.api.open("sales/quotation/print/type/bank/ids/" +  Config.quotation.id, __("Select a collection bank"), {
                    area:["90%","90%"],
                    callback: function (ret) {
                        if (ret.code === 1) {
                            Fast.api.open("sales/quotation/print/type/pi/ids/" + Config.quotation.id,)
                        }
                    }
                })
            });

            $(".btn-copy").click(function () {
                Fast.api.open("sales/quotation/copy/update/false/ids/" + Config.quotation.id, __("Copy"),{
                    callback: function (data) {
                        Fast.api.addtabs("sales/quotation/detail/ids/"+ data.data.ids, data.data.ref_no + ' ' + __("Detail"))
                    },
                    area: ["90%","90%"],
                })
            });

            // 初始化表格参数配置
            Table.api.init({
                showFooter:true,
                extend: {
                    index_url: 'sales/quotation_item/index' + location.search,
                    add_url: 'sales/quotation_item/add/currency/' + Config.quotation.currency + '/quotation_id/' + Config.quotation.id,
                    edit_url: 'sales/quotation_item/edit/currency/'+ Config.quotation.currency +'/update/false',
                    del_url: 'sales/quotation_item/del',
                    multi_url: 'sales/quotation_item/multi',
                    table: 'quotation_item',
                }
            });

            var table = $("#table");

            if (Config.quotation.currency === "CNY"){
                cny = true; usd = false;
            } else {
                cny = false; usd = true;
            }
            Config.quotation.tax_rate > 0 ? tax = true: tax = false;

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                queryParams: function(params){
                    var filter = JSON.parse(params.filter);
                    var op = JSON.parse(params.op);
                    filter.quotation_id = Config.quotation.id;
                    op.quotation_id = '=';
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
                        {field: 'weight', title: __('Weight'), operate:'BETWEEN', footerFormatter: function (row) {
                                var sum = 0;
                                $.map(row, function (val) {
                                    sum += val['weight'];
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
                        {field: 'carton', title: __('Carton'), formatter: function (value, row) {
                                return value ? Math.ceil(row['quantity']/value['rate']):row['quantity'];
                            }, footerFormatter: function (row) {
                                var sum = 0;
                                $.map(row, function(val){
                                    if(val['carton']){
                                        sum += Math.ceil(val['quantity']/val['carton']['rate']);
                                    } else {
                                        sum += val['quantity'];
                                    }
                                });
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
                                /*var sum = 0;
                                var amount = 0;
                                $.map(row, function (val) {
                                    sum += val['amount']/(1 - Config.quotation.tax_rate/100);
                                    amount += val['amount'];
                                });
                                return "<span data-toggle='tooltip' title='"+__('Tax')+": "+ (sum - amount).toFixed(2) +"'>"+"￥ "+sum.toFixed(2)+"</span>";*/
                                var sum = 0;
                                $.map(row, function (val) {
                                    sum += val['tax_amount'];
                                })
                                return "￥ " + sum.toFixed(2);
                            },visible: tax},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate, buttons: [
                                {
                                    name: 'copy',
                                    title: __('Copy'),
                                    classname: 'btn btn-xs btn-success btn-dialog',
                                    icon: 'fa fa-copy',
                                    url: 'sales/quotation_item/copy/currency/'+ Config.quotation.currency,
                                    confirm: '是否复制该产品？'
                                }
                            ]}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
    };
    return Controller;
});