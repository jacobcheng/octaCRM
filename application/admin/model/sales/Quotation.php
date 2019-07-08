<?php

namespace app\admin\model\sales;

use think\Model;
use traits\model\SoftDelete;

class Quotation extends Model
{

    use SoftDelete;

    //数据库
    protected $connection = 'database';
    // 表名
    protected $name = 'quotation';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'currency_text',
        'incoterms_text',
        'leadtime_text',
        'transport_text'
    ];
    

    
    public function getCurrencyList()
    {
        return ['USD' => __('Usd'), 'CNY' => __('Cny')];
    }

    public function getIncotermsList()
    {
        return ['EXW' => __('Exw'), 'FCA' => __('Fca'), 'FAS' => __('Fas'), 'FOB' => __('Fob'), 'CFR' => __('Cfr'), 'CIF' => __('Cif'), 'CPT' => __('Cpt'), 'CIP' => __('Cip'), 'DAT' => __('Dat'), 'DAP' => __('Dap'), 'DDP' => __('Ddp')];
    }

    public function getTransportList()
    {
        return ['Express Service' => __('Express service'), 'By Sea' => __('By sea'), 'By Air' => __('By air'), 'By Train' => __('By train'), 'By Road' => __('By road')];
    }


    public function getCurrencyTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['currency']) ? $data['currency'] : '');
        $list = $this->getCurrencyList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getIncotermsTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['incoterms']) ? $data['incoterms'] : '');
        $list = $this->getIncotermsList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getLeadtimeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['leadtime']) ? $data['leadtime'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }


    public function getTransportTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['transport']) ? $data['transport'] : '');
        $list = $this->getTransportList();
        return isset($list[$value]) ? $list[$value] : '';
    }

    protected function setLeadtimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }


    public function user()
    {
        return $this->belongsTo('app\admin\model\User', 'client_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
