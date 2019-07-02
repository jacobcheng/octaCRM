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
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'logo', title: __('Logo')},
                        {field: 'name', title: __('Name')},
                        {field: 'short_name', title: __('Short_name')},
                        {field: 'source', title: __('Source'), searchList: {"独立网站":__('独立网站'),"阿里巴巴国际":__('阿里巴巴国际'),"中国制造":__('中国制造')}, formatter: Table.api.formatter.normal},
                        {field: 'type', title: __('Type'), searchList: {"零售商":__('零售商'),"批发商":__('批发商'),"品牌商":__('品牌商'),"进口商":__('进口商')}, formatter: Table.api.formatter.normal},
                        {field: 'star', title: __('Star'), searchList: {"1":__('Star 1'),"2":__('Star 2'),"3":__('Star 3'),"4":__('Star 4'),"5":__('Star 5')}, formatter: Table.api.formatter.normal},
                        {field: 'country_code', title: __('Country_code')},
                        {field: 'city_code', title: __('City_code')},
                        {field: 'website', title: __('Website')},
                        {field: 'tel', title: __('Tel')},
                        {field: 'fax', title: __('Fax')},
                        {field: 'contactor_id', title: __('Contactor_id')},
                        {field: 'status', title: __('Status'), searchList: {"new":__('Status new'),"followed":__('Status followed'),"inquired":__('Status inquired'),"ordered":__('Status ordered'),"invalid":__('Status invalid')}, formatter: Table.api.formatter.status},
                        {field: 'country.name', title: __('Country.name')},
                        {field: 'city.name', title: __('City.name')},
                        {field: 'contactor.appellation', title: __('Contactor.appellation')},
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
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});