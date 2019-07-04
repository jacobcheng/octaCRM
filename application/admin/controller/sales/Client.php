<?php

namespace app\admin\controller\sales;

use app\common\controller\Backend;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\exception\ValidateException;

/**
 * 客户管理
 *
 * @icon fa fa-circle-o
 */
class Client extends Backend
{
    
    /**
     * Client模型对象
     * @var \app\admin\model\sales\Client
     */
    protected $model = null;

    /**
     * 是否开启数据限制
     * 支持auth/personal
     * 表示按权限判断/仅限个人
     * 默认为禁用,若启用请务必保证表中存在admin_id字段
     */
    protected $dataLimit = 'personal';

    /**
     * 数据限制字段
     */
    protected $dataLimitField = 'admin_id';

    /**
     * 数据限制开启时自动填充限制字段值
     */
    protected $dataLimitFieldAutoFill = true;

    /**
     * 是否开启Validate验证
     */
    protected $modelValidate = false;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\sales\Client;
        $this->view->assign("sourceList", $this->model->getSourceList());
        $this->view->assign("typeList", $this->model->getTypeList());
        $this->view->assign("starList", $this->model->getStarList());
        $this->view->assign("statusList", $this->model->getStatusList());
    }
    
    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */
    

    /**
     * 查看
     */
    public function index()
    {
        //当前是否为关联查询
        $this->relationSearch = true;
        //设置过滤方法
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model
                    ->with(['country','contact','admin'])
                    ->where($where)
                    ->order($sort, $order)
                    ->count();

            $list = $this->model
                    ->with(['country','contact','admin'])
                    ->where($where)
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();

            foreach ($list as $row) {
                $row->visible(['id','short_name','source','type','star','remark','status']);
                $row->visible(['country']);
				$row->getRelation('country')->visible(['country_name','timezone']);
                $row->visible(['admin']);
                $row->getRelation('admin')->visible(['nickname']);
				$row->visible(['contact']);
				$row->getRelation('contact')->visible(['appellation','email','cc_email']);
            }
            $list = collection($list)->toArray();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }

    public function add()
    {
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a");
            if ($params) {
                $params = $this->preExcludeFields($params);

                if ($this->dataLimit && $this->dataLimitFieldAutoFill) {
                    $params[$this->dataLimitField] = $this->auth->id;
                }
                $result = false;
                Db::startTrans();
                try {
                    //是否采用模型验证
                    if ($this->modelValidate) {
                        $name = str_replace("\\model\\", "\\validate\\", get_class($this->model));
                        $validate = is_bool($this->modelValidate) ? ($this->modelSceneValidate ? $name . '.add' : $name) : $this->modelValidate;
                        //if (isset($params['addcontact'])) $this->model->addcontact = $params['addcontact'];
                        $this->model->validateFailException(true)->validate($validate);
                    }
                    $result = $this->model->allowField(true)->save($params);
                    Db::commit();
                } catch (ValidateException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (PDOException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (Exception $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                }
                if ($result !== false) {
                    $this->addContact($params['addcontact'], $this->model->id);
                    $this->updateContact($this->model);
                    $this->success();
                } else {
                    $this->error(__('No rows were inserted'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        return $this->view->fetch();
    }

    public function edit($ids = null)
    {
        $row = $this->model->get($ids);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        $adminIds = $this->getDataLimitAdminIds();
        if (is_array($adminIds)) {
            if (!in_array($row[$this->dataLimitField], $adminIds)) {
                $this->error(__('You have no permission'));
            }
        }
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a");
            if ($params) {
                $params = $this->preExcludeFields($params);
                $result = false;
                Db::startTrans();
                try {
                    //是否采用模型验证
                    if ($this->modelValidate) {
                        $name = str_replace("\\model\\", "\\validate\\", get_class($this->model));
                        $validate = is_bool($this->modelValidate) ? ($this->modelSceneValidate ? $name . '.edit' : $name) : $this->modelValidate;
                        //客户联系人验证逻辑
                        $row->validateFailException(true)->validate($validate);
                    }
                    $result = $row->allowField(true)->save($params);
                    Db::commit();
                } catch (ValidateException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (PDOException $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                } catch (Exception $e) {
                    Db::rollback();
                    $this->error($e->getMessage());
                }
                if ($result !== false) {
                    //已有联系人的添加方式
                    if (isset($params['contact'])) {
                       $ids = array_diff(array_column($row['allcontact'],'id'),array_column($params['contact'], 'id'));
                       if ($ids) {
                           $this->delContact($ids);
                       }
                        foreach ($params['contact'] as $param){
                            $contact = new Contact;
                            $contact->editContact($param);
                        }
                    } else {
                        $this->delContact(array_column($row['allcontact'], 'id'));
                    }
                    if (isset($params['addcontact'])) {
                        $this->addContact($params['addcontact'],$row->id);
                    }
                    $this->updateContact($row);
                    $this->success();
                } else {
                    $this->error(__('No rows were updated'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        $this->assignconfig('client_id', $row['id']);
        $this->view->assign("row", $row);
        return $this->view->fetch();
    }

    private function updateContact ($client)
    {
        $contact = model('app\admin\model\sales\Contact');
        if (!$contact->get($client->contact_id)) {
            $id = $contact->where(['client_id' => $client->id])->limit(1)->value('id');
            $client->save(['contact_id' => $id]);
        }
    }

    private function addContact($contacts,$id)
    {
        foreach ($contacts as $row) {
            $contact = new Contact;
            $contact->addContact($row, $id);
        }
    }

    private function delContact($ids)
    {
        $contact = new Contact;
        $contact->delContact($ids);
    }

    public function checkdata()
    {
        if ($this->request->isPost()) {
            $validate = validate('app\admin\validate\sales\Client');
            $params = $this->request->post('row/a');
            if (!$validate->scene(key($params))->check($params)){
                return $this->error($validate->getError());
            } else {
                return $this->success();
            }
        }
    }
}
