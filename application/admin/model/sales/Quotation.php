<?php

namespace app\admin\model\sales;

use think\Model;
use traits\model\SoftDelete;
use think\Db;

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

    protected $insert = ['ref_no'];

    protected function setRefNoAttr ()
    {
        $num = self::whereTime('createtime', 'd')->count();
        return 'LW'.date('Ymd').sprintf("%03d",$num+1);
    }

    protected function setCountryCodeAttr ($value, $data)
    {
        return $value ? : Db::name('client')->where('id', $data['client_id'])->value('country_code');
    }

    public function getCreatetimeAttr ($value)
    {
        return date('Y-m-d', $value);
    }
    
    public function getCurrencyList()
    {
        return ['USD' => __('USD'), 'CNY' => __('CNY')];
    }

    public function getIncotermsList()
    {
        return ['EXW' => __('EXW'), 'FCA' => __('FCA'), 'FAS' => __('FAS'), 'FOB' => __('FOB'), 'CFR' => __('CFR'), 'CIF' => __('CIF'), 'CPT' => __('CPT'), 'CIP' => __('CIP'), 'DAT' => __('DAT'), 'DAP' => __('DAP'), 'DDP' => __('DDP')];
    }

    public function getTransportList()
    {
        return ['Express Service' => __('Express Service'), 'By Sea' => __('By Sea'), 'By Air' => __('By Air'), 'By Train' => __('By Train'), 'By Road' => __('By Road')];
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


    public function client()
    {
        return $this->belongsTo('app\admin\model\sales\Client', 'client_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function user()
    {
        return $this->belongsTo('app\admin\model\User', 'admin_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function country()
    {
        return $this->belongsTo('app\admin\model\Country', 'country_code', 'code', [], 'LEFT')->setEagerlyType(0);
    }
}
