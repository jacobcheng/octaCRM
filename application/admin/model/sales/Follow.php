<?php

namespace app\admin\model\sales;

use think\Model;
use traits\model\SoftDelete;

class Follow extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'follow';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'channel_text'
    ];

    protected $insert = [
        'admin_id'
    ];

    public function setAdminIdAttr ()
    {
        return session('admin.id');
    }

    
    public function getChannelList()
    {
        return ['mail' => __('Mail'), 'elephone' => __('Telephone'), 'skype' => __('Skype'), 'wechat' => __('Wechat'), 'visit' => __('Visit'), 'SNS' => __('Sns')];
    }


    public function getChannelTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['channel']) ? $data['channel'] : '');
        $list = $this->getChannelList();
        return isset($list[$value]) ? $list[$value] : '';
    }

    public function getCreatetimeAttr($value){
        return date('Y-m-d', $value);
    }





    public function client()
    {
        return $this->belongsTo('app\admin\model\sales\Client', 'client_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function contact()
    {
        return $this->belongsTo('app\admin\model\sales\Contact', 'contact_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function quotation()
    {
        return $this->belongsTo('app\admin\model\sales\Quotation', 'quotation_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function order()
    {
        return $this->belongsTo('app\admin\model\sales\Order', 'order_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function admin()
    {
        return $this->belongsTo('app\admin\model\Admin', 'admin_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
