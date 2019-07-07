<?php

namespace app\admin\controller\products;

use app\common\controller\Backend;

/**
 * 
 *
 * @icon fa fa-circle-o
 */
class ProductModel extends Backend
{
    
    /**
     * ProductModel模型对象
     * @var \app\admin\model\ProductModel
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\products\ProductModel;

    }
    
    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */
    

    /**
     * 查看
     */
    public function index()
    {
        //当前是否为关联查询
        $this->relationSearch = true;
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                    ->with(['category','client'])
                    ->where($where)
                    ->order($sort, $order)
                    ->count();

            $list = $this->model
                    ->with(['category','client'])
                    ->where($where)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();

            foreach ($list as $row) {
                $row->visible(['id','model','category_id','client_id','description','description_cn','hscode','rebate_rate','images']);
                $row->visible(['category']);
				$row->getRelation('category')->visible(['name','nickname']);
				$row->visible(['client']);
				$row->getRelation('client')->visible(['short_name']);
            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }

    public function detail ($id = null)
    {
        $row = $this->model->with(['category','client'])->find($id);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        //$row['images'] = explode(",",$row['images']);
        //$this->assignconfig('model_id',$row['id']);
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }

    public function getCatalog ()
    {
        if  ($this->request->isAjax()) {
            //$id = $this->request->request('id');
            $lang = $this->request->request('lang');
            //if (!$id) return $this->error(__('Parameter %s can not be empty', ''));
            //$where['type'] = 'catalog';
            $datalist = model('app\admin\model\Category')
                      ->where(['type' => 'catalog'])
                      ->order('weigh asc')
                      ->field('id,pid,name,nickname')
                      ->select();

            $list [] = ['id' => '0', 'parent' => '#', 'text' => __('All'), 'state' => ['opened' => true, 'selected' => true]];
            foreach ($datalist as $value) {
                $list[] = [
                    'id' => $value['id'],
                    'parent' => $value['pid'] ? : '0',
                    'text'   => $lang === 'zh-cn' ? $value['name'] : $value['nickname'],
                    'state'  => ['opened' => true]
                ];
            }
            return json($list);
        }
    }
}
