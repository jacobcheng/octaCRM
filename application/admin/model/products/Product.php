<?php

namespace app\admin\model\products;

use think\Model;
use traits\model\SoftDelete;

class Product extends Model
{

    use SoftDelete;

    //数据库
    protected $connection = 'database';
    // 表名
    protected $name = 'product';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'unit_text'
    ];
    

    
    public function getUnitList()
    {
        return ['PC' => __('Pc'), 'SET' => __('Set'), 'BOX' => __('Box'), 'CARTON' => __('Carton'), 'G' => __('G'), 'KG' => __('Kg'), 'TON' => __('Ton'), 'CBM' => __('Cbm'), 'UNIT' => __('Unit')];
    }


    public function getUnitTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['unit']) ? $data['unit'] : '');
        $list = $this->getUnitList();
        return isset($list[$value]) ? $list[$value] : '';
    }




    public function productmodel()
    {
        return $this->belongsTo('app\admin\model\products\ProductModel', 'model_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
