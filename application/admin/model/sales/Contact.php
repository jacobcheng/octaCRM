<?php

namespace app\admin\model\sales;

use think\Model;
use traits\model\SoftDelete;

class Contact extends Model
{

    use SoftDelete;

    //数据库
    protected $connection = 'database';
    // 表名
    protected $name = 'contact';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [

    ];
    

    







    public function client()
    {
        return $this->belongsTo('app\admin\model\Client', 'client_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
