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
        'transport_text',
        'status_text',
        'total_amount'
    ];

    protected $insert = ['ref_no', 'status' => 1];

    protected  static function init()
    {
        Quotation::event('after_insert', function ($quotation) {
            $client = model('app\admin\model\sales\Client')->get($quotation->client_id);
            if ($client->status < '30') {
                $client->save(['status' => '30']);
            }
        });
    }

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

    public function getStatusList()
    {
        return ['10' => __('New'), '20' => __('Quoted'), '30' => __('Ordered'), '-1' => __('Expired')];
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


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }

    public function getServiceAttr ($value)
    {
        return json_decode($value, true);
    }

    protected function setLeadtimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }

    public function getTotalAmountAttr ($value, $data)
    {
        //var_dump(Db::name('QuotationItem')->where('quotation_id',$data['id'])->sum('amount'));
        return Db::name('QuotationItem')->where('quotation_id',$data['id'])->sum('amount');
    }

    public function getTotalUsdAmountAttr ($value, $data)
    {
        return Db::name('QuotationItem')->where('quotation_id',$data['id'])->sum('usd_amount');
    }

    public function getTotalTaxAmountAttr ($value, $data)
    {
        return Db::name('QuotationItem')->where('quotation_id',$data['id'])->sum('tax_amount');
    }

    public function getServiceAmountAttr ()
    {
        $amount = 0;
        if ($this->service) {
            foreach ($this->service as $value) {
                $amount += $value['cost'];
            }
        }
        return $amount;
    }

    public function getTotalCbmAttr ()
    {
        return Db::name('quotation_item')->where('quotation_id', $this->id)->sum('cbm');
    }

    public function getTotalWeightAttr ()
    {
        return Db::name('quotation_item')->where('quotation_id', $this->id)->sum('weight');
    }

    //获取单位运费
    public function getUnitFee ($newcbm = 0, $newweight = 0, $id = 0)
    {
        $total_cbm = Db::name('quotation_item')->where(['quotation_id' => $this->id, 'id' => ['<>', $id]])->sum('cbm') + $newcbm;
        $total_weight = Db::name('quotation_item')->where(['quotation_id' => $this->id, 'id' => ['<>', $id]])->sum('weight') + $newweight;
        if ($this->incoterms !== "EXW" && $total_cbm != 0){
            switch ($this->incoterms) {
                case 'Express Service':
                    list($cbm, $weight) = [$total_cbm * 200, $total_weight];
                    return $cbm > $weight ? ['cbm' => round($this->transport_fee / $total_cbm, 2)]:['weight' => round($this->transport_fee / $weight, 2)];
                    break;

                case 'By Air':
                    list($cbm, $weight) = [$total_cbm * 1.67, $total_weight];
                    return $cbm > $weight ? ['cbm' => round($this->transport_fee / $total_cbm, 2)]:['weight' => round($this->transport_fee / $weight, 2)];
                    break;

                default:
                    return ['cbm' => $this->transport_fee / $total_cbm];
                    break;
            }
        } else {
            return ['weight' => 0];
        }
    }



    public function client()
    {
        return $this->belongsTo('app\admin\model\sales\Client', 'client_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function contact()
    {
        return $this->belongsTo('app\admin\model\sales\Contact', 'contact_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function Admin()
    {
        return $this->belongsTo('app\admin\model\Admin', 'admin_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function country()
    {
        return $this->belongsTo('app\admin\model\Country', 'country_code', 'code', [], 'LEFT')->setEagerlyType(0);
    }


    public function bank()
    {
        return $this->belongsTo('app\admin\model\accounting\Bank', 'bank_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public  function items()
    {
        return $this->hasMany('app\admin\model\sales\QuotationItem', 'quotation_id', 'id', [], 'LEFT');
    }
}
