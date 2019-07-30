<?php

namespace app\admin\controller\sales;

use app\common\controller\Backend;
use NumberToWords\NumberToWords;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\exception\ValidateException;

/**
 * 
 *
 * @icon fa fa-circle-o
 */
class Order extends Backend
{

    protected $noNeedRight = ['updateitems', 'updatestatus'];
    /**
     * Quotation模型对象
     * @var \app\admin\model\sales\Quotation
     */
    protected $model = null;

    /**
     * 是否开启数据限制
     * 支持auth/personal
     * 表示按权限判断/仅限个人
     * 默认为禁用,若启用请务必保证表中存在admin_id字段
     */
    protected $dataLimit = 'personal';

    /**
     * 数据限制字段
     */
    protected $dataLimitField = 'admin_id';

    /**
     * 数据限制开启时自动填充限制字段值
     */
    protected $dataLimitFieldAutoFill = true;

    /**
     * 是否开启Validate验证
     */
    protected $modelValidate = false;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\sales\Order;
        $this->view->assign("currencyList", $this->model->getCurrencyList());
        $this->view->assign("incotermsList", $this->model->getIncotermsList());
        $this->view->assign("transportList", $this->model->getTransportList());
        $this->view->assign("statusList", $this->model->getStatusList());
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
                    ->with(['client','contact','country','admin'])
                    ->where($where)
                    ->order($sort, $order)
                    ->count();

            $list = $this->model
                    ->with(['client','contact','country','admin'])
                    ->where($where)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();

            foreach ($list as $row) {
                $row->visible(['id','ref_no','client_id','currency','incoterms','leadtime','transport','balance','admin_id','createtime','status']);
                $row->visible(['client']);
				$row->getRelation('client')->visible(['short_name']);
				$row->visible(['contact']);
				$row->getRelation('contact')->visible(['appellation','email','cc_email']);
				$row->visible(['country']);
				$row->getRelation('country')->visible(['country_name']);
				$row->visible(['admin']);
				$row->getRelation('admin')->visible(['nickname']);
            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }

    /*public function add()
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
                    $params = $this->prepareSave($params);
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
    }*/

    public function copy ($ids = null, $update = false) {
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
                    //$params = $this->prepareSave($params, $update, $row);
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
                    if (!empty($params['copyitem'])) {
                        $this->copyitems($params['copyitem'], $params['olditems'], $update);
                    }
                    $this->success('', '', ['ids' => $this->model->id, 'ref_no' => $this->model->ref_no]);
                } else {
                    $this->error(__('No rows were inserted'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        $row = $this->model->get($ids);
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }

    public function detail ($ids = null)
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
        $this->assignconfig('order', $row);
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }

    public function placeorder ($ids = null)
    {
        $row = model("app\admin\model\sales\Quotation")->get($ids);
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
                    $params['quotation_id'] = $ids;
                    $params['balance'] = round($row['service_amount'] + ($row['currency'] === "CNY" ? ($row['tax_rate'] > 0 ? $row['total_tax_amount']:$row['total_amount']) : $row['total_usd_amount']), 2);
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
                    foreach ($row->items as $item) {
                        unset($item['id'], $item['quotation_id'], $item['unit_cost']);
                        $item['product'] = json_encode($item['product']);
                        $item['accessory'] = json_encode($item['accessory']);
                        $item['package'] = json_encode($item['package']);
                        $item['accessory'] = json_encode($item['accessory']);
                        $item['carton'] = json_encode($item['carton']);
                        $this->model->items()->save($item);
                    }
                    $this->success('', '', ['ids' => $this->model->id, 'ref_no' => $this->model->ref_no]);
                } else {
                    $this->error(__('No rows were inserted'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        $row['leadtime'] = date('Y-m-d', time() + ($row['leadtime'] * 24 * 60 * 60));
        $this->view->assign('row', $row);
        return $this->fetch('edit');
    }

    public function print ($ids = null, $type)
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
        $client = model('app\admin\model\sales\Client')->get($row['client_id']);
        $totalamount = $row['currency']==="CNY" ? ($row['tax_rate'] > 0 ? $row['total_tax_amount'] : $row['total_amount']) : $row['total_usd_amount'];
        $numberToWords = new NumberToWords();
        $currency = $numberToWords->getCurrencyTransformer('en');
        $saytotal = $currency->towords(($totalamount+$row['service_amount'])*100, "USD");
        $this->view->assign(["row" =>  $row, "client" => $client, "saytotal" => $saytotal]);
        if ($type === "ci") {
            return $this->view->fetch("print_ci");
        } elseif ($type === "pl") {
            return $this->view->fetch("print_pl");
        }
    }

    /*public static function prepareSave ($data, $update = true, $row = [])
    {
        $quotation =  model('app\admin\model\sales\order')->get($data['order_id']);
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
            if (empty($row) || $update) {
                foreach ($accessory as $value) {
                    $data['unit_cost'] += $value['cost'];
                    $data['weight'] += $value['weight'] * $data['quantity'];
                }
                $data['accessory'] = json_encode($accessory);
            } else {
                $data['accessory'] = [];
                foreach ($accessory as $value) {
                    foreach ($row['accessory'] as $val){
                        if ($value['id'] == $val['id']){
                            $data['unit_cost'] += $val['cost'];
                            $data['weight'] += $val['weight'] * $data['quantity'];
                            $data['accessory'][] = $val;
                        } else {
                            $data['unit_cost'] += $value['cost'];
                            $data['weight'] += $value['weight'] * $data['quantity'];
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
    }*/
}
