<?php

namespace app\admin\model\sales;

use think\Db;
use think\Model;
use traits\model\SoftDelete;

class Order extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'order';
    
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
        'status_text'
    ];

    protected $insert = [
        'ref_no',
        'status' => 1
    ];

    protected static function init()
    {
        Order::event("after_insert", function ($order) {
            if (!empty($order->quotation_id)) {
                $quotation = $order->quotation;
                if ($quotation['status'] < '30') {
                    $quotation->save(['status' => "30"]);
                }
            };
            $client = $order->client;
            if ($client->status < '40') {
                $client->save(['status' => '40']);
            }
            $receivable = new \app\admin\model\accounting\Receivables;
            $receivable['order_id'] = $order->id;
            $receivable['currency'] = $order->currency;
            $receivable['total_amount'] = $order->quotation->service_amount + ($order->currency === 'CNY' ? ($order->tax_rate > 0 ? $order->quotation->total_tax_amount:$order->quotation->total_amount):$order->quotation->total_usd_amount);
            $receivable['receivables'] = $order->quotation->service_amount + ($order->currency === 'CNY' ? ($order->tax_rate > 0 ? $order->quotation->total_tax_amount:$order->quotation->total_amount):$order->quotation->total_usd_amount) * $order->prepay / 100;
            $receivable['bank_id'] = $order->quotation->bank_id;
            $receivable['admin_id'] = $order->quotation->admin_id;
            $receivable->save();
        });
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
        return ['10' => __('Pending'), '20' => __('Processing'), '30' => __('Collected'), '40' => __('Completed'), '-1' => __('Cancel')];
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

    public function setRefNoAttr ()
    {
        $num = self::whereTime('createtime', 'd')->count();
        return "SC".date("Ymd").sprintf("%03d",$num+1);
    }

    /*protected function setLeadtimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }*/


    public function getTotalAmountAttr ($value, $data)
    {
        //var_dump(Db::name('QuotationItem')->where('quotation_id',$data['id'])->sum('amount'));
        return Db::name('OrderItem')->where('order_id',$data['id'])->sum('amount');
    }

    public function getTotalUsdAmountAttr ($value, $data)
    {
        return Db::name('OrderItem')->where('order_id',$data['id'])->sum('usd_amount');
    }

    public function getTotalTaxAmountAttr ($value, $data)
    {
        return Db::name('OrderItem')->where('order_id',$data['id'])->sum('tax_amount');
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

    public function getServiceAttr ($value)
    {
        return json_decode($value, true);
    }

    public function getCreateTimeAttr($value)
    {
        return date('Y-m-d', $value);
    }


    public function quotation()
    {
        return $this->belongsTo('app\admin\model\sales\Quotation', 'quotation_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function client()
    {
        return $this->belongsTo('app\admin\model\sales\Client', 'client_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function contact()
    {
        return $this->belongsTo('app\admin\model\sales\Contact', 'contact_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function country()
    {
        return $this->belongsTo('app\admin\model\Country', 'country_code', 'code', [], 'LEFT')->setEagerlyType(0);
    }


    public function admin()
    {
        return $this->belongsTo('app\admin\model\Admin', 'admin_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }

    public function items()
    {
        return $this->hasMany('app\admin\model\sales\OrderItem', 'order_id', 'id', [], 'LEFT');
    }
}
