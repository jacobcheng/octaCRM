<?php

namespace app\admin\controller;

use app\common\controller\Backend;
use think\Config;
use app\admin\controller\Calendar;

/**
 * 控制台
 *
 * @icon fa fa-dashboard
 * @remark 用于展示当前系统中的统计数据、统计报表及重要实时数据
 */
class Dashboard extends Backend
{

    /**
     * 查看
     */
    public function index()
    {
        $schedule = $this->getschedule();
        $sample = $this->getsample();
        $client = model('app\admin\model\sales\Client');
        $total_client = $client->where(['admin_id' => $this->auth->id])->whereTime('createtime', 'year')->count();
        $total_quoted = $client->where(['admin_id' => $this->auth->id, 'status' => [['egt','20'],['lt','40'],'and']])->whereTime('createtime', 'year')->count();
        $total_ordered = $client->where(['admin_id' => $this->auth->id, 'status' => '40'])->whereTime('createtime', 'year')->count();

        /*$seventtime = \fast\Date::unixtime('day', -7);
        $paylist = $createlist = [];
        for ($i = 0; $i < 7; $i++)
        {
            $day = date("Y-m-d", $seventtime + ($i * 86400));
            $createlist[$day] = mt_rand(20, 200);
            $paylist[$day] = mt_rand(1, mt_rand(1, $createlist[$day]));
        }
        $hooks = config('addons.hooks');
        $uploadmode = isset($hooks['upload_config_init']) && $hooks['upload_config_init'] ? implode(',', $hooks['upload_config_init']) : 'local';
        $addonComposerCfg = ROOT_PATH . '/vendor/karsonzhang/fastadmin-addons/composer.json';
        Config::parse($addonComposerCfg, "json", "composer");
        $config = Config::get("composer");
        $addonVersion = isset($config['version']) ? $config['version'] : __('Unknown');
        $this->view->assign([
            'totaluser'        => 35200,
            'totalviews'       => 219390,
            'totalorder'       => 32143,
            'totalorderamount' => 174800,
            'todayuserlogin'   => 321,
            'todayusersignup'  => 430,
            'todayorder'       => 2324,
            'unsettleorder'    => 132,
            'sevendnu'         => '80%',
            'sevendau'         => '32%',
            'paylist'          => $paylist,
            'createlist'       => $createlist,
            'addonversion'       => $addonVersion,
            'uploadmode'       => $uploadmode
        ]);*/


        $this->assign([
            'schedule' => $schedule,
            'sample' => $sample,
            'total_client' => $total_client,
            'total_quoted' => $total_quoted,
            'total_ordered' => $total_ordered
        ]);

        return $this->view->fetch();
    }

    public function getschedule ()
    {
        $today = model('Calendar')
                ->where('admin_id', $this->auth->id)
                ->whereTime('starttime', 'd')
                ->order('id desc')
                ->select();

        $repeat = model('Calendar')
                ->where(['admin_id' => ['eq', $this->auth->id], 'distance' => ['gt',0]])
                ->select();

        if (!empty($repeat)) {
            $start = strtotime(date('Y-m-d'));
            $end = $start + 24 * 60 * 60;
            $today_repeat = Calendar::getRepeatEvents($repeat, $start, $end);

            if (!empty($today_repeat)) {
                $today = array_merge($today, $today_repeat);
            }
        }
        return $today;
    }

    public function getsample ()
    {
        return model('app\admin\model\products\Sample')
                ->where(['admin_id' => ['eq', $this->auth->id], 'status' => ['lt','3']])
                ->select();
    }

    public function getclientstatis()
    {
        if(request()->isAjax()){
            list($year, $data, $i) = [date('Y'), [], 01];
            do{
                $start = $year."-01-01";
                $data['month'][] = sprintf("%02d",$i)." 月";
                $i++;
                $end = $i<13 ? $year."-".$i."-01":date('Y-m-d');
                $client= model('app\admin\model\sales\Client');
                $data['new'][] = $client->where(['admin_id' => $this->auth->id])->whereTime('createtime', 'between', [$start,$end])->count();
                $data['quoted'][] = $client->where(['admin_id' => $this->auth->id, 'status' => [['egt','20'],['lt','40'],'and']])->whereTime('createtime', 'between', [$start,$end])->count();
                $data['ordered'][] = $client->where(['admin_id' => $this->auth->id, 'status' => '40'])->whereTime('createtime', 'between', [$start,$end])->count();

            }while ($i <= date('m'));
            $this->success('','',$data);
        }
    }

}
