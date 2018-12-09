<template>
   <div class="profile-head app-card mb-30">
      <div class="profile-top">
        <img src="/static/img/profile-banner.jpg" alt="profile banner" height="165" />
      </div>
      <div class="profile-bottom border-bottom-light-1">
        <div class="user-image text-xs-center mb-3">
          <img src="/static/img/avatar_dummy.jpg" class="img-responsive rounded-circle" alt="user images" />
        </div>
        <div class="user-list-content">
          <div class="text-xs-center">
            <h3 class="fw-bold">{{$auth.user().name}}</h3>
            <p>{{$t('message.user')}}</p>
          </div>
        </div>
      </div>
      <div class="user-activity text-xs-center">
        <ul class="list-inline d-inline-block">
          <li>
            <span class="fw-bold">{{$auth.user().nodecount}}</span>
            <span v-if="$auth.user().nodecount>1">{{$t('message.nodes')}}</span>
            <span v-else>{{$t('message.node')}}</span>
          </li>
          <li>
            <span class="fw-bold">{{$auth.user().walletcount}}</span>
            <span v-if="$auth.user().walletcount>1">{{$t('message.wallets')}}</span>
            <span v-else>{{$t('message.wallet')}}</span>
          </li>
        </ul>
      </div>
    </div>
</template>

