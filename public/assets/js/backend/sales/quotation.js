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
                sortName: 'createtime',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'ref_no', title: __('Ref_no')},
                        {field: 'client.short_name', title: __('Client_id')},
                        {field: 'country.country_name', title: __('Country')},
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
                        {field: 'user.nickname', title: __('Admin_id')},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange'},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate, buttons: [
                                {
                                    name: 'Detail',
                                    title: __('Detail'),
                                    classname: 'btn btn-xs btn-success btn-addtabs',
                                    icon: 'fa fa-list',
                                    url: 'sales/quotation/detail'
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
                $('#c-switch').change(function () {
                    var destination = $('#c-destination,#c-country_code');
                    if ($(this).is(':checked')){
                        destination.closest('.form-group').show();
                        $('.sp_container').css('width', '100%');
                    } else {
                        destination.closest('.form-group').hide();
                        destination.val('');
                    }
                });
                $('#c-incoterms').change(function () {
                    var terms = $(this).val();
                    if (terms === 'FCA'|| terms === 'FAS'|| terms === 'FOB'|| terms === 'CFR'|| terms === 'CPT') {
                        var insurance = $('#c-destination');
                        $("#c-transport,#c-transport_fee").closest('.form-group').show();
                        insurance .closest('.form-group').hide();
                        insurance .val('');
                    } else if (terms === 'CIF'|| terms === 'CIP'|| terms === 'DAT'|| terms === 'DPT'|| terms === 'DAP' || terms === 'DDP') {
                        $("#c-transport,#c-transport_fee,#c-insurance").closest('.form-group').show();
                        console.log(terms);
                    } else  {
                        var selectors = $("#c-transport,#c-transport_fee,#c-insurance");
                        selectors.closest('.form-group').hide();
                        selectors.val('');
                    }
                });
                $(function () {
                    if ($('#c-destination').val()) {
                        $('#c-switch').trigger('click');
                    };
                    var terms = $('#c-incoterms').val();
                    if (terms === 'FCA'|| terms === 'FAS'|| terms === 'FOB'|| terms === 'CFR'|| terms === 'CPT') {
                        console.log(terms);
                        $("#c-transport,#c-transport_fee").closest('.form-group').show();
                    } else if (terms === 'CIF'|| terms === 'CIP'|| terms === 'DAT'|| terms === 'DPT'|| terms === 'DAP' || terms === 'DDP') {
                        $("#c-transport,#c-transport_fee,#c-insurance").closest('.form-group').show();
                    } else {
                        return;
                    }
                })
            }
        }
    };
    return Controller;
});