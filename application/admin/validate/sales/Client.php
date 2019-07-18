<?php

namespace app\admin\validate\sales;

use think\Validate;

class Client extends Validate
{
    /**
     * 验证规则
     */
    protected $rule = [
        'name|客户全名' => 'require|unique:client|max:128',
        'short_name|简称' => 'require|unique:client|max:64',
        'country_code' => 'require|max:3',
        'city_code' => 'max:9',
        'website' => 'url|max:255',
        'tel' => 'max:32',
        'fax' => 'max:32',
        'address' => 'max:255',
    ];
    /**
     * 提示消息
     */
    protected $message = [
    ];
    /**
     * 验证场景
     */
    protected $scene = [
        'add'  => ['name','short_name'],
        'edit' => [],
        'name' => ['name' => 'require'],
        'short_name' => ['short_name' => 'require'],
    ];
    
}
