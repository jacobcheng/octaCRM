<?php

namespace app\admin\model\products;

use think\Model;
use traits\model\SoftDelete;

class Sample extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'sample';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'status_text'
    ];

    protected $insert = [
        'admin_id',
        'ref_no'
    ];

    
    public function getStatusList()
    {
        return ['1' => __('Pending'), '2' => __('Arranged'), '3' => __('Completed'), '4' => __('Canceled')];
    }

    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }

    public function getCreatetimeAttr ($value) {
        return date("Y-m-d", $value);
    }

    public function getEstimateddateAttr ($value) {
        return $value > 0 ? $value: '-';
    }

    public function setAdminIdAttr ()
    {
        return session('admin.id');
    }

    public function setRefNoAttr ()
    {
        $num = self::whereTime('createtime', 'd')->count();
        return "SP".date("Ymd").sprintf("%03d",$num+1);
    }


    public function client()
    {
        return $this->belongsTo('app\admin\model\sales\Client', 'client_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function user()
    {
        return $this->belongsTo('app\admin\model\User', 'admin_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
