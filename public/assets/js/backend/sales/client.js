define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

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
                rowStyle: rowStyle,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'short_name', title: __('Short_name')},
                        {field: 'source', title: __('Source'), searchList: {"独立网站":__('独立网站'),"阿里巴巴国际":__('阿里巴巴国际'),"中国制造":__('中国制造')}, formatter: Table.api.formatter.normal},
                        {field: 'type', title: __('Type'), searchList: {"零售商":__('零售商'),"批发商":__('批发商'),"品牌商":__('品牌商'),"进口商":__('进口商')}, formatter: Table.api.formatter.normal},
                        {field: 'star', title: __('Star'), searchList: {"1":__('Star 1'),"2":__('Star 2'),"3":__('Star 3'),"4":__('Star 4'),"5":__('Star 5')}, formatter: Table.api.formatter.normal},
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
                        {field: 'status', title: __('Status'), searchList: {"new":__('Status new'),"followed":__('Status followed'),"inquired":__('Status inquired'),"ordered":__('Status ordered'),"invalid":__('Status invalid')}, formatter: Table.api.formatter.status},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ],
                onLoadSuccess: function () {
                    $('.btn-editone').data('area', ['90%', '90%']);
                }
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
        }
    };
    return Controller;
});