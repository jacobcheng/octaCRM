<?php

namespace app\admin\controller\sales;

use app\common\controller\Backend;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\exception\ValidateException;

/**
 * 
 *
 * @icon fa fa-circle-o
 */
class QuotationItem extends Backend
{
    
    /**
     * QuotationItem模型对象
     * @var \app\admin\model\products\QuotationItem
     */
    protected $model = null;

    /**
     * 无需鉴权的方法,但需要登录
     * @var array
     */
    protected $noNeedRight = ['checkupdate'];

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\sales\QuotationItem;

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
                    ->with(['quotation'])
                    ->where($where)
                    ->order($sort, $order)
                    ->count();

            $list = $this->model
                    ->with(['quotation'])
                    ->where($where)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();

            foreach ($list as $row) {
                $row->visible(['id','product','accessory','package','carton','process','weight','cbm','quantity','profit','unit_price','usd_unit_price','amount','usd_amount','tax_amount']);
            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }

    public function add()
    {
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a");
            if ($params) {
                $params = $this->preExcludeFields($params);

                if ($this->dataLimit && $this->dataLimitFieldAutoFill) {
                    $params[$this->dataLimitField] = $this->auth->id;
                }
                $result = false;
                Db::startTrans();
                try {
                    //是否采用模型验证
                    if ($this->modelValidate) {
                        $name = str_replace("\\model\\", "\\validate\\", get_class($this->model));
                        $validate = is_bool($this->modelValidate) ? ($this->modelSceneValidate ? $name . '.add' : $name) : $this->modelValidate;
                        $this->model->validateFailException(true)->validate($validate);
                    }
                    $params = $this->prepareSave($params, true, []);
                    $result = $this->model->allowField(true)->save($params);
                    Db::commit();
                } catch (ValidateException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (PDOException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (Exception $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                }
                if ($result !== false) {
                    $this->success();
                } else {
                    $this->error(__('No rows were inserted'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        return $this->view->fetch();
    }

    public function edit($ids = null, $update = false)
    {
        $row = $this->model->get($ids);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        $adminIds = $this->getDataLimitAdminIds();
        if (is_array($adminIds)) {
            if (!in_array($row[$this->dataLimitField], $adminIds)) {
                $this->error(__('You have no permission'));
            }
        }
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a");
            if ($params) {
                $params = $this->preExcludeFields($params);
                $result = false;
                Db::startTrans();
                try {
                    //是否采用模型验证
                    if ($this->modelValidate) {
                        $name = str_replace("\\model\\", "\\validate\\", get_class($this->model));
                        $validate = is_bool($this->modelValidate) ? ($this->modelSceneValidate ? $name . '.edit' : $name) : $this->modelValidate;
                        $row->validateFailException(true)->validate($validate);
                    }
                    $params = $this->prepareSave($params, $update, $row);
                    $result = $row->allowField(true)->save($params);
                    Db::commit();
                } catch (ValidateException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (PDOException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (Exception $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                }
                if ($result !== false) {
                    $this->success();
                } else {
                    $this->error(__('No rows were updated'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        $this->assignconfig("quotation", $row->quotation);
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }

    public function copy ($ids = null, $update= false) {
        $row = $this->model->get($ids);
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a");
            if ($params) {
                $params = $this->preExcludeFields($params);

                if ($this->dataLimit && $this->dataLimitFieldAutoFill) {
                    $params[$this->dataLimitField] = $this->auth->id;
                }
                $result = false;
                Db::startTrans();
                try {
                    //是否采用模型验证
                    if ($this->modelValidate) {
                        $name = str_replace("\\model\\", "\\validate\\", get_class($this->model));
                        $validate = is_bool($this->modelValidate) ? ($this->modelSceneValidate ? $name . '.add' : $name) : $this->modelValidate;
                        $this->model->validateFailException(true)->validate($validate);
                    }
                    $params = $this->prepareSave($params, $update, $row);
                    unset($params['id']);
                    $result = $this->model->allowField(true)->save($params);
                    Db::commit();
                } catch (ValidateException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (PDOException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (Exception $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                }
                if ($result !== false) {
                    $this->success();
                } else {
                    $this->error(__('No rows were inserted'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }

    public static function prepareSave ($data, $update = true, $row = [])
    {
        $quotation =  model('app\admin\model\sales\Quotation')->get($data['quotation_id']);
        $product = (!empty($row) && !$update && $data['product'] == (isset($row['product']['id']) ? : $data['product'])) ?  $row['product']: model('app\admin\model\products\Product')->find($data['product']);
        $productCBM = $product['length'] * $product['width'] * $product['height'];
        $packageCBM = $product['plength'] * $product['pwidth'] * $product['pheight'];
        $cbm = $packageCBM > $productCBM ? $packageCBM : $productCBM;
        list($data['cbm'], $data['weight'], $data['unit_cost']) = [round($cbm/1000000,3) * $data['quantity'], ($product['pweight'] ? : $product['weight'])*$data['quantity'], $product['cost']];
        $data['product'] = json_encode($product);

        if ($data['process']){
            foreach (json_decode($data['process'], true) as $value) {
                $data['unit_cost'] += $value['cost'];
            }
        }
        $pnc = 0;
        if ($data['package']){
            $package = (!empty($row) && !$update && $data['package'] = (isset($row['package']['id']) ? : $data['package'])) ? $row['package'] : model('app\admin\model\products\Package')->find($data['package']);
            $data['cbm'] = round($package['length'] * $package['width'] * $package['height'] / 1000000,3)*$data['quantity'];
            $data['weight'] += $package['weight'] * $data['quantity'];
            //$data['unit_cost'] += $package['cost'];
            $pnc += $package['cost'];
            $data['package'] = json_encode($package);
        }

        if ($data['carton']){
            $carton = (!empty($row) && !$update && $data['carton'] = (isset($row['carton']['id']) ? : $data['carton'])) ? $row['carton'] : model('app\admin\model\products\Carton')->find($data['carton']);
            $qty = ceil($data['quantity']/$carton['rate']);
            $data['cbm'] = round($carton['length'] * $carton['width'] * $carton['height'] / 1000000,3) * $qty;
            $data['weight'] += $carton['weight'] * $qty;
            $data['unit_cost'] += round($carton['cost']/$carton['rate'], 2);
            $pnc += round($carton['cost']/$carton['rate'], 2);
            $data['carton'] = json_encode($carton);
        }

        if ($data['accessory']){
            $accessory = model('app\admin\model\products\Accessory')->all($data['accessory']);
            if (!empty($row) || $update) {
                foreach ($accessory as $value) {
                    $data['unit_cost'] += $value['cost'];
                    $data['weight'] += $value['weight'];
                }
                $data['accessory'] = json_encode($accessory);
            } else {
                $data['accessory'] = [];
                foreach ($accessory as $value) {
                    foreach ($row['accessory'] as $val){
                        if ($value['id'] == $val['id']){
                            $data['unit_cost'] += $val['cost'];
                            $data['weight'] += $val['weight'];
                            $data['accessory'][] = $val;
                        } else {
                            $data['unit_cost'] += $value['cost'];
                            $data['weight'] += $value['weight'];
                            $data['accessory'][] = $value;
                        }
                    }
                }
                $data['accessory'] = json_encode($data[$accessory]);
            }
        }

        if (!isset($data['unit_price']) || !$data['unit_price']) {
            $id = isset($row['id']) ? $row['id'] : '0';
            $unit_fee = $quotation->getUnitFee($data['cbm'], $data['weight'], $id);
            if (count($quotation->items) > 0) {
                foreach ($quotation->items as $value) {
                    if ($value['id'] != $id) {
                        $value['unit_price'] = round((($value[key($unit_fee)] * current($unit_fee) / $value['quantity']) + ($value['unit_cost'] * (1 + $value['profit'] / 100)) + $value['carton']['cost'] + $value['package']['cost']) * (1 + $quotation->insurance / 10000), 2);
                        $value['amount'] = $value['unit_price'] * $value['quantity'];
                        $value['usd_unit_price'] = round($value['unit_price'] / $quotation['rate'], 2);
                        $value['usd_amount'] = $value['usd_unit_price'] * $value['quantity'];
                        $value['tax_amount'] = $quotation['rate'] > 0 ? $value['amount']/(1 - $quotation['tax_rate']/100):'';
                        $value->save();
                    }
                }
            }
            $data['unit_price'] = round((($data[key($unit_fee)] * current($unit_fee)/$data['quantity']) + ($data['unit_cost'] * (1 + $data['profit']/100)) + $pnc) * (1 + $quotation->insurance/10000), 2);
        }
        if ($quotation['currency'] == "USD" && (!isset($data['usd_unit_price']) || !$data['usd_unit_price'])) {
            $data['usd_unit_price'] = round($data['unit_price']/$quotation['rate'],2);
            $data['usd_amount'] = $data['usd_unit_price'] * $data['quantity'];
        }
        $data['amount'] = $data['unit_price'] * $data['quantity'];
        if ($quotation['tax_rate'] > 0) {
            $data['tax_amount'] = $data['amount']/(1 - $quotation['tax_rate']/100);
        }
        return $data;
    }

    public function checkupdate ($ids = null)
    {
        if ($this->request->isAjax()) {
            $row = $this->model->find($ids);
            $params = $this->request->post();
            $data = '';
            foreach ($params as $key => $value) {
                if ($value) {
                    if ($key == "accessory" && count($row['accessory']) != 0) {
                        $ids = explode(',',$value);
                        foreach ($row['accessory'] as $val) {
                            if (in_array($val['id'],$ids)) {
                                $cost =  model('app\admin\model\products\Accessory')->where('id', $val['id'])->find();
                                if ($val['cost'] != $cost['cost']) {
                                    $data = $data . (empty($data) ? __('Accessory') : ', '.__('Accessory')).': '.$cost['name'];
                                }
                            }
                        }
                    } else {
                        if (isset($row[$key])) {
                            $uckey = ucwords($key);
                            $cost = model('app\admin\model\products\\' . $uckey)->where('id', $params[$key])->value('cost');
                            if (isset($row[$key]['cost']) && $row[$key]['cost'] != $cost) {
                                $data = $data . (empty($data) ? __($uckey) : ', '.__($uckey));
                            }
                        }
                    }
                }
            }
            if ($data) {
                return $this->error($data . __('Cost'));
            } else {
                return $this->success();
            }
        }
    }
}
