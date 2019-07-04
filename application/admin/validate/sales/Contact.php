<?php

namespace app\admin\validate\sales;

use think\Validate;

class Contact extends Validate
{
    /**
     * 验证规则
     */
    protected $rule = [
        'email|邮箱' => 'require|unique:contact',
        'cc_email|CC邮箱' => 'require'
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
        'email' => ['email'],
        'cc_email' => ['cc_email'],
    ];
    
}
