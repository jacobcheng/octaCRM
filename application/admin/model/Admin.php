<?php

namespace app\admin\model;

use think\Model;
use think\Session;
use traits\model\SoftDelete;

class Admin extends Model
{
    use SoftDelete;

    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    protected $append = [
        'department'
    ];
    /**
     * 重置用户密码
     * @author baiyouwen
     */
    public function resetPassword($uid, $NewPassword)
    {
        $passwd = $this->encryptPassword($NewPassword);
        $ret = $this->where(['id' => $uid])->update(['password' => $passwd]);
        return $ret;
    }

    public function getDepartmentAttr ($value, $data) {
        //return $data['department_id'] > 0 ? $this->department()->name : "超级管理员";
        return $data['department_id'] > 0 ? model('Category')->where('id', $data['department_id'])->value('name') : '超级管理员';
    }

    // 密码加密
    protected function encryptPassword($password, $salt = '', $encrypt = 'md5')
    {
        return $encrypt($password . $salt);
    }

    /*public function department ()
    {
        return $this->belongsTo('Category','department_id', 'id', '', 'LEFT')->setEagerlyType(0);
    }*/

}
