define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'adminlte'], function ($, undefined, Backend, Table, Form, Adminlte) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'sales/client/index' + location.search,
                    add_url: 'sales/client/add',
                    edit_url: 'sales/client/edit',
                    del_url: 'sales/client/del',
                    multi_url: 'sales/client/multi',
                    table: 'client',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'updatetime',
                showColumns: false,
                showToggle: false,
                showExport: false,
                rowStyle: rowStyle,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'short_name', title: __('Short_name')},
                        {field: 'source', title: __('Source'), searchList: {"独立网站":__('独立网站'),"阿里巴巴国际":__('阿里巴巴国际'),"中国制造":__('中国制造')}, formatter: Table.api.formatter.normal},
                        {field: 'type', title: __('Type'), searchList: {"零售商":__('零售商'),"批发商":__('批发商'),"品牌商":__('品牌商'),"进口商":__('进口商')}, formatter: Table.api.formatter.normal},
                        {field: 'star', title: __('Star'), searchList: {"1":__('★'),"2":__('★★'),"3":__('★★★'),"4":__('★★★★'),"5":__('★★★★★')}, formatter: Table.api.formatter.normal, custom: {'1':'gray','2':'info','3':'success','4':'warning','5':'danger'}},
                        {field: 'country.country_name', title: __('Country'),formatter: function (value, row) {
                                var now = new Date(new Date().getTime()+(row['country']['timezone']-8)*60*60*1000);
                                return "<span data-toggle='tooltip' title='Current Time: "+now.toLocaleString()+"'>"+value+"</span>";
                            }
                        },
                        {field: 'contact.appellation', title: __('Contact'),formatter: function(value, row) {
                            var cc_email = row['contact']['cc_email'] ? "?cc="+row['contact']['cc_email'] : '';
                            return "<a href='mailto:"+row['contact']['email']+cc_email+"'>"+value+"</a>";
                            }
                        },
                        {field: 'admin.nickname', title: __('Admin')},
                        {field: 'status', title: __('Status'), searchList: {"10":__('New'),"20":__('Followed'),"30":__('Quoted'),"40":__('Ordered'),"-1":__('Invalid')}, formatter: Table.api.formatter.status, custom: {'10':'gray','20':'info','30':'warning','40':'success','-1':'danger'}},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate, buttons: [
                                {
                                    name: 'edit',
                                    icon: 'fa fa-pencil',
                                    title: __('Edit'),
                                    extend: 'data-toggle="tooltip" data-area=\'["90%","90%"]\'',
                                    classname: 'btn btn-xs btn-success btn-editone',
                                },
                                {
                                    name: 'detail',
                                    title: __('Detail'),
                                    classname: 'btn btn-xs btn-success btn-click',
                                    extend: 'data-toggle="tooltip"',
                                    icon: 'fa fa-list',
                                    click: function (value, row) {
                                        Fast.api.addtabs("sales/client/detail/ids/"+row.id, row.short_name +' '+ __('Detail'))
                                    }
                                },
                                {
                                    name: 'del',
                                    icon: 'fa fa-trash',
                                    title: __('Del'),
                                    extend: 'data-toggle="tooltip"',
                                    classname: 'btn btn-xs btn-danger btn-delone'
                                }
                            ]}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
            
            function rowStyle(row, index) {
                if (row['country']['timezone']){
                    var now = new Date(new Date().getTime()+(row['country']['timezone']-8)*60*60*1000).getHours();
                    if (now > 8 && now <= 17) {
                        return {classes:'success'};
                    } else if (now > 17 && now <= 22) {
                        return {classes:'warning'};
                    } else {
                        return {classes:'danger'};
                    }
                } else {
                    return {classes:''};
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
                url: 'sales/client/recyclebin' + location.search,
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
                                    url: 'sales/client/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'sales/client/destroy',
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
            Controller.api.delForm($('.delForm'));
            $('#c-contact_id').data('params', function () {
                return {custom: {client_id:Config.client_id}};
            })
        },
        api: {
            bindevent: function () {
                $("form[role=form]").validator({
                    rule: {
                        mobile: [/\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/, "请输入正确的国际通用手机号码"],
                    },
                    fields:{
                        'row[name]': "required; length[~128]; remote(sales/client/checkdata, id:#id)",
                        'row[short_name]': 'required; length[~64]; remote(sales/client/checkdata, id:#id)',
                        'row[source]': 'required',
                        'row[type]': 'required',
                        'row[star]': 'required',
                        'row[country]': 'required',
                        'row[website]': 'url; length[~128]',
                        'row[address]': 'length[~255]',
                        'row[tel]': 'length[~32]',
                    },
                });
                Form.api.bindevent($("form[role=form]"), '', '', function () {
                    var size = $(".box-body").children().size();
                    if (size <= 2) {
                        $(".box").removeClass("box-default").addClass("box-danger box-solid");
                        $(".box-body").children("span").addClass("text-danger").text("联系人不能为空");
                        return false;
                    } else {
                        $(".box-body").children("span").addClass("text-success").text("");
                        $(".box").removeClass("box-default box-danger box-solid").addClass("box-success box-solid");
                        //Form.api.submit(this);
                        return ;
                    }
                    //return false;
                });
                $('#c-city_code').data('params', function () {
                    return {custom:{country_code:$('#c-country_code').val()}}
                });
                $('#c-country_code').change(function () {
                    $('#c-city_code').selectPageClear();
                });
                $('#addForm').click(function () {
                    var num = $(this).parent().children().length - 1;
                    var html = $('#addContactForm').html();
                    $(this).before(html.replace(/0/g,num));
                    Controller.api.delForm($('.delForm'));
                    Form.events.datetimepicker($("form[role=form]"));
                });
            },
            delForm: function (delForm) {
                delForm.click(function () {
                    $(this).closest('.contactForm').remove();
                });
            }
        },
        detail: function () {

            $("#btn-edit").click(function () {
                Fast.api.open("sales/client/edit/ids/"+Config.client.id, __('Edit'),{area:["90%","90%"]})
            });

            $("#btn-follow").click(function () {
                Fast.api.open("sales/follow/add/client_id/" + Config.client.id, __('Add Follow'))
            });

            // 初始化表格参数配置
            Table.api.init();

            //绑定事件
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var panel = $($(this).attr("href"));
                if (panel.size() > 0 && panel.attr("id") !== "follow") {
                    Controller.table[panel.attr("id")].call(this);
                    $(this).on('click', function (e) {
                        $($(this).attr("href")).find(".btn-refresh").trigger("click");
                    });
                }
                //移除绑定的事件
                $(this).unbind('shown.bs.tab');
            });

            //必须默认触发shown.bs.tab事件
            $('ul.nav-tabs li.active a[data-toggle="tab"]').trigger("shown.bs.tab");
        },
        table: {
            quotation: function () {
                var quotationTable = $("#quotationTable");
                quotationTable.bootstrapTable({
                    url: 'sales/quotation/index',
                    toolbar: "#toolbar1",
                    pk: 'id',
                    sortName: 'id',
                    queryParams: function(params){
                        var filter = JSON.parse(params.filter);
                        var op = JSON.parse(params.op);
                        filter.client_id = Config.client.id;
                        op.quotation_id = '=';
                        params.filter = JSON.stringify(filter);
                        params.op = JSON.stringify(op);
                        return params;
                    },
                    showColumns: false,
                    showToggle: false,
                    showExport: false,
                    columns: [
                        [
                            {field: 'ref_no', title: __('Ref_no')},
                            {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange'},
                            {field: 'incoterms', title: __('Incoterms'), searchList: {"EXW":__('EXW'),"FCA":__('FCA'),"FAS":__('FAS'),"FOB":__('FOB'),"CFR":__('CFR'),"CIF":__('CIF'),"CPT":__('CPT'),"CIP":__('CIP'),"DAT":__('DAT'),"DAP":__('DAP'),"DDP":__('DDP')}, formatter: Table.api.formatter.normal},
                            {field: 'total_amount', title: __('Total Amount'), formatter: function (value, row) {
                                    return value.toFixed(2);
                                }},
                            {field: 'status', title: __('Status'), searchList: {"10":__('New'),"20":__('Quoted'),"30":__('Print PI'),"40":__('Ordered'),"-1":__('Expired')}, formatter: Table.api.formatter.status, custom: {'10':'info','20':'info','30':'success','-1':'danger'}},
                            {field: 'operate', title: __('Operate'), table: quotationTable, events: Table.api.events.operate, formatter: function (value, row, index) {
                                    return Table.api.buttonlink(this, this.buttons, value, row, index, 'operate');
                                }, buttons:
                                    [
                                        {
                                            name: 'detail',
                                            title: function (row) {
                                                return row.ref_no + " " +  __('Detail');
                                            },
                                            classname: 'btn btn-xs btn-success btn-click',
                                            extend: 'data-toggle="tooltip"',
                                            icon: 'fa fa-list',
                                            click: function (value,row) {
                                                Backend.api.addtabs("sales/quotation/detail/ids/"+row.id, row.ref_no +' '+ __('Detail'))
                                            }
                                        }
                                    ]}
                        ],
                    ]
                });
            },
            order:function () {
                var orderTable = $("#orderTable");
                orderTable.bootstrapTable({
                    url: 'sales/order/index',
                    toolbar: "#toolbar2",
                    pk: 'id',
                    sortName: 'id',
                    queryParams: function(params){
                        var filter = JSON.parse(params.filter);
                        var op = JSON.parse(params.op);
                        filter.client_id = Config.client.id;
                        op.order_id = '=';
                        params.filter = JSON.stringify(filter);
                        params.op = JSON.stringify(op);
                        return params;
                    },
                    showColumns: false,
                    showToggle: false,
                    showExport: false,
                    columns: [
                        [
                            {field: 'ref_no', title: __('Ref_no')},
                            {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange'},
                            {field: 'incoterms', title: __('Incoterms'), searchList: {"EXW":__('EXW'),"FCA":__('FCA'),"FAS":__('FAS'),"FOB":__('FOB'),"CFR":__('CFR'),"CIF":__('CIF'),"CPT":__('CPT'),"CIP":__('CIP'),"DAT":__('DAT'),"DAP":__('DAP'),"DDP":__('DDP')}, formatter: Table.api.formatter.normal},
                            {field: 'leadtime', title: __('Leadtime')},
                            {field: 'status', title: __('Status'), searchList: {"10":__('Pending'),"20":__('Processing'),"30":__('Collected'),"40":__('Completed'),"-1":__('Cancel')}, formatter: Table.api.formatter.status, custom: {"10":"gray","20":"info","30":"warning","40":"success","-1":"danger"}},
                            {field: 'operate', title: __('Operate'), table: orderTable, events: Table.api.events.operate, formatter: function (value, row, index) {
                                    return Table.api.buttonlink(this, this.buttons, value, row, index, 'operate');
                                }, buttons: [
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
            },
            contact: function () {
                Table.api.init({
                    extend: {
                        index_url: 'sales/contact/index' + location.search,
                        add_url: 'sales/contact/add',
                        edit_url: 'sales/contact/edit',
                        del_url: 'sales/contact/del',
                        multi_url: 'sales/contact/multi',
                        table: 'contact',
                    }
                });

                var contactTable = $("#contactTable");

                // 初始化表格
                contactTable.bootstrapTable({
                    url: $.fn.bootstrapTable.defaults.extend.index_url,
                    toolbar: "#toolbar3",
                    pk: 'id',
                    sortName: 'id',
                    queryParams: function(params){
                        var filter = JSON.parse(params.filter);
                        var op = JSON.parse(params.op);
                        filter.client_id = Config.client.id;
                        op.order_id = '=';
                        params.filter = JSON.stringify(filter);
                        params.op = JSON.stringify(op);
                        return params;
                    },
                    columns: [
                        [
                            {checkbox: true},
                            {field: 'image', title: __('Image'), events: Table.api.events.image, formatter: Table.api.formatter.image},
                            {field: 'appellation', title: __('Appellation')},
                            {field: 'name', title: __('Name')},
                            {field: 'title', title: __('Title')},
                            {field: 'email', title: __('Email')},
                            {field: 'cc_email', title: __('Cc_email')},
                            {field: 'operate', title: __('Operate'), table: contactTable, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                        ]
                    ]
                });

                // 为表格绑定事件
                Table.api.bindevent(contactTable);
            }
        }
    };
    return Controller;
});