<?php

namespace app\admin\model\products;

use think\Model;
use traits\model\SoftDelete;

class QuotationItem extends Model
{

    use SoftDelete;

    //数据库
    protected $connection = 'database';
    // 表名
    protected $name = 'quotation_item';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [

    ];
    

    







    public function quotation()
    {
        return $this->belongsTo('app\admin\model\sales\Quotation', 'quotation_id', 'id', [], 'LEFT')->setEagerlyType(0);
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
