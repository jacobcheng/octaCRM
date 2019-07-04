<?php

namespace app\admin\validate\sales;

use think\Validate;

class Client extends Validate
{
    /**
     * 验证规则
     */
    protected $rule = [
        'name|客户全名' => 'require|unique:client',
        'short_name|简称' => 'require|unique:client'
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
        'add'  => [],
        'edit' => [],
        'name' => ['name'],
        'short_name' => ['short_name'],
    ];
    
}
