<?php

namespace app\admin\model\sales;

use think\Db;
use think\Model;
use traits\model\SoftDelete;

class OrderItem extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'order_item';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [

    ];

    public function getProductAttr ($value)
    {
        return json_decode($value, true);
    }

    public function getPackageAttr ($value)
    {
        return json_decode($value, true);
    }

    public function getCartonAttr ($value)
    {
        return json_decode($value, true);
    }

    public function getAccessoryAttr ($value)
    {
        return $value ? json_decode($value, true):[];
    }

    public function getProcessAttr ($value)
    {
        return json_decode($value, true);
    }

    public function getCatalogIdAttr ($value, $data)
    {
        return Db::name('product_model')->where('id', $this->product['model_id'])->value('category_id');
    }

    public function setProcessAttr ($value)
    {
        return $value ? $value:"{}";
    }





    public function order()
    {
        return $this->belongsTo('app\admin\model\sales\Order', 'order_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }

    public function product()
    {
        return $this->belongsTo('app\admin\model\products\Product', 'product_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function accessory()
    {
        return $this->belongsTo('app\admin\model\products\Accessory', 'accessory_ids', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function package()
    {
        return $this->belongsTo('app\admin\model\products\Package', 'package_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function carton()
    {
        return $this->belongsTo('app\admin\model\products\Carton', 'carton_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
