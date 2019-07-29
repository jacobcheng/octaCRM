<?php

namespace app\admin\model\sales;

use think\Model;
use traits\model\SoftDelete;

class Client extends Model
{

    use SoftDelete;

    //数据库
    protected $connection = 'database';
    // 表名
    protected $name = 'client';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'source_text',
        'type_text',
        'star_text',
        'status_text'
    ];

    protected $insert = [
        'status' => '10'
    ];

    
    public function getSourceList()
    {
        return ['独立网站' => __('独立网站'), '阿里巴巴国际' => __('阿里巴巴国际'), '中国制造' => __('中国制造')];
    }

    public function getTypeList()
    {
        return ['零售商' => __('零售商'), '批发商' => __('批发商'), '品牌商' => __('品牌商'), '进口商' => __('进口商')];
    }

    public function getStarList()
    {
        return ['1' => __('★'), '2' => __('★★'), '3' => __('★★★'), '4' => __('★★★★'), '5' => __('★★★★★')];
    }

    public function getStatusList()
    {
        return ['10' => __('New'), '20' => __('Followed'), '30' => __('Quoted'), '40' => __('Ordered'), '-1' => __('Invalid')];
    }


    public function getSourceTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['source']) ? $data['source'] : '');
        $list = $this->getSourceList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
        $list = $this->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getStarTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['star']) ? $data['star'] : '');
        $list = $this->getStarList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }




    public function country()
    {
        return $this->belongsTo('app\admin\model\Country', 'country_code', 'code', [], 'LEFT')->setEagerlyType(0);
    }


    public function city()
    {
        return $this->belongsTo('app\admin\model\City', 'city_code', 'code', [], 'LEFT')->setEagerlyType(0);
    }

    public function admin()
    {
        return $this->belongsTo('app\admin\model\Admin', 'admin_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }

    public function contact()
    {
        return $this->belongsTo('app\admin\model\sales\Contact', 'contact_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }

    public function allcontact()
    {
        return $this->hasMany('app\admin\model\sales\Contact', 'client_id', 'id', [], 'LEFT');
    }

    public function follows()
    {
        return $this->hasMany('app\admin\model\sales\Follow', 'client_id', 'id', [], 'LEFT');
    }
}
