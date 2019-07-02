<?php


namespace app\admin\model;
use think\Model;


class Country extends Model
{
    protected  $connection = 'database';
    protected  $append = [
        'country_name',
    ];

    public function  getCountryNameAttr ($value, $data)
    {
        return $data['name'].'('.$data['name_cn'].')';
    }
}