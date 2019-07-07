<?php

namespace app\admin\model\products;

use think\Model;
use traits\model\SoftDelete;

class ProductModel extends Model
{

    use SoftDelete;

    //数据库
    protected $connection = 'database';
    // 表名
    protected $name = 'product_model';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
            'image'
    ];
    

    





    public function getImageAttr ($value, $data)
    {
        $images = explode(',',$data['images']);
        return $images[0];
    }

    public function category()
    {
        return $this->belongsTo('app\admin\model\Category', 'category_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function client()
    {
        return $this->belongsTo('app\admin\model\sales\Client', 'client_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
