<?php

namespace app\admin\model\accounting;

use think\Model;
use traits\model\SoftDelete;

class Receivables extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'receivables';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'currency_text',
        'status_text',
        /*'type_text'*/
    ];

    protected $insert = [
        'status' => 1
    ];

    /*public function getTypeList()
    {
        return ['middlepay' => __('Middle Pay'), 'tailpay' => __('Tail Pay'), 'prepay' => __('Prepay')];
    }*/
    
    public function getCurrencyList()
    {
        return ['USD' => __('USD'), 'CNY' => __('CNY')];
    }

    public function getStatusList()
    {
        return ['1' => __('Pending'), '2' => __('Confirm')];
    }

    /*public function getTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
        $list = $this->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }*/

    public function getCurrencyTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['currency']) ? $data['currency'] : '');
        $list = $this->getCurrencyList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }




    public function order()
    {
        return $this->belongsTo('app\admin\model\sales\Order', 'order_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function bank()
    {
        return $this->belongsTo('app\admin\model\accounting\Bank', 'bank_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function admin()
    {
        return $this->belongsTo('app\admin\model\Admin', 'admin_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
