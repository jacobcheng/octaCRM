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
                cardView: true,
                /*columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'model', title: __('Model')},
                        {field: 'category_id', title: __('Category_id')},
                        {field: 'client_id', title: __('Client_id')},
                        {field: 'description', title: __('Description')},
                        {field: 'description_cn', title: __('Description_cn')},
                        {field: 'hscode', title: __('Hscode')},
                        {field: 'rebate_rate', title: __('Rebate_rate')},
                        {field: 'category.name', title: __('Category.name')},
                        {field: 'category.nickname', title: __('Category.nickname')},
                        {field: 'client.short_name', title: __('Client.short_name')},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]*/
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

        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});