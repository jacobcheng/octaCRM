<?php


namespace app\admin\model;
use think\Model;


class City extends Model
{
    protected  $connection = 'database';
    protected  $append = [
        'city_name'
    ];

    public function getCityNameAttr ($value, $data)
    {
        return $data['name'].'('.$data['name_nc'].')';
    }
}