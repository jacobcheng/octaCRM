define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'jstree', 'adminlte'], function ($, undefined, Backend, Table, Form, Jstree, Adminlte) {

    var Controller = {
        index: function () {
            $("#CatalogTree").jstree({
                "core": {
                    "check_callback" : true,
                    "data": {
                        url: "./products/product_model/getCatalog",
                        data:function (node) {
                            //return { 'id':node.id,'lang':Config.language};
                            return {'lang':Config.language};
                        }
                    }
                }
            }).on("select_node.jstree", function (e, data){
                Table.api.init({
                    extend: {
                        add_url: 'products/product_model/add/category_id/'+data.node.id
                    }
                });
                function getChildNodes(treeNode, result) {
                    var childrenNodes = data.instance.get_children_dom(treeNode);
                    if (childrenNodes) {
                        for (var i = 0; i < childrenNodes.length; i++) {
                            var row = childrenNodes[i];
                            if ($.inArray(row.id, result) == -1) {
                                result.push(row.id);
                            }
                            result = getChildNodes(row.id, result);
                        }
                    }
                    return result;
                };
                var result = [];
                result.push(data.node.id);
                var childNodes = data.instance.get_children_dom(data.node)
                for (var i = 0; i < childNodes.length; i++) {
                    var row = childNodes[i];
                    if ($.inArray(row.Id, result) == -1) {
                        result.push(row.id);
                    }
                    getChildNodes(row, result);
                }
                if (data.node && firstLoaded != 1) {
                    dptIds = result; //保存选中的节点ID
                    dptParentId = data.node.parent; //保存选中的节点父ID
                    //app.loaddata(1);
                };

                var options = table.bootstrapTable('getOptions');
                options.queryParams = function (params) {
                    var filter = {category_id:result};
                    var op = {category_id:'IN'};
                    params.filter = JSON.stringify(filter);
                    params.op = JSON.stringify(op);
                    return params;
                }
                table.bootstrapTable('refresh',options);
            }).on('loaded.jstree', function (e, data) {
                //当tree加载完毕时，获取树的根节点对象；
                //调用select_node方法，选择根节点。
                firstLoaded = 1;
                var inst = data.instance;
                var obj = inst.get_node(e.target.firstChild.firstChild.lastChild);
                inst.select_node(obj);
                firstLoaded = 2;
            });


            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'products/product_model/index' + location.search,
                    add_url: 'products/product_model/add/category_id/0',
                    edit_url: 'products/product_model/edit',
                    del_url: 'products/product_model/del',
                    multi_url: 'products/product_model/multi',
                    table: 'product_model',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                templateView: true,
                showHeader: false,
                showColumns: false,
                showToggle: false,
                commonSearch: false,
                showExport: false,
                detailView: true,
                cardView: true
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
                url: 'products/product_model/recyclebin' + location.search,
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
                                    url: 'products/product_model/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'products/product_model/destroy',
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
        detail: function () {
            Table.api.init({
                extend: {
                    index_url: 'products/product/index' + location.search,
                    add_url: 'products/product/add/model_id/' + Config.model_id,
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
                queryParams: function (params) {
                    var filter = JSON.parse(params.filter);
                    var op = JSON.parse(params.op);
                    filter.model_id = Config.model_id;
                    op.model_id = '=';
                    params.filter = JSON.stringify(filter);
                    params.op = JSON.stringify(op);
                    return params;
                },
                columns: [
                    [
                        {checkbox: true},
                        {field: 'code', title: __('Code')},
                        {field: 'description', title: __('Description'), formatter: function (value, row) {
                                return Config.language === 'zh-cn' ? row['description_cn'] : value;
                            }
                        },
                        //{field: 'description_cn', title: __('Description_cn')},
                        {field: 'unit', title: __('Unit'), searchList: {"PC":__('PC'),"SET":__('SET'),"BOX":__('BOX'),"CARTON":__('CARTON'),"G":__('G'),"KG":__('KG'),"TON":__('TON'),"CBM":__('CBM')}, formatter: Table.api.formatter.normal},
                        {field: 'moq', title: __('Moq')},
                        {field: 'weight', title: __('Weight'), operate:'BETWEEN'},
                        /*{field: 'length', title: __('Length'), operate:'BETWEEN'},
                        {field: 'width', title: __('Width'), operate:'BETWEEN'},
                        {field: 'height', title: __('Height'), operate:'BETWEEN'},*/
                        {field: 'size', title: __('Size'), formatter: function (value, row) {
                                return row['length'] + ' × ' + row['width'] + ' × ' + row['height']
                            }},
                        {field: 'package', title: __('Package'), formatter: function (value) {
                                return value ? value : '-';
                            }},
                        {field: 'pweight', title: __('Package Weight'), operate:'BETWEEN', formatter: function (value, row) {
                                return row['package'] ? value : '-';
                            }},
                        /*{field: 'plength', title: __('Plength'), operate:'BETWEEN'},
                        {field: 'pwidth', title: __('Pwidth'), operate:'BETWEEN'},
                        {field: 'pheight', title: __('Pheight'), operate:'BETWEEN'},*/
                        {field: 'psize', title: __('Package Size'),formatter: function (value, row) {
                                return row['package'] ? row['plength'] + ' × ' + row['pwidth'] + ' × ' + row['pheight'] : '-';
                            }},
                        {field: 'cost', title: __('Cost'), operate:'BETWEEN', formatter: function (value) {
                                return value.toFixed(2);
                            }},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate, buttons: [
                                {
                                    name: 'Copy',
                                    title: __('Copy'),
                                    classname: 'btn btn-xs btn-success btn-dialog',
                                    icon: 'fa fa-copy',
                                    url: 'products/product/copy'
                                }
                            ]}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
            //console.log(Config);
        },
        api: {
            bindevent: function () {
                $("form[role=form]").validator({
                    fields: {
                        "#c-model" : "required;length[~32]",
                        "#c-category_id" : "required",
                        "#c-description" : "required;length[~64]",
                        "#c-description_cn" : "required;length[~128]",
                        "#c-hscode" : "length[~10]",
                        "#c-rebate_rate" : "integer(+0);range(0~99)"
                    }
                });
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});