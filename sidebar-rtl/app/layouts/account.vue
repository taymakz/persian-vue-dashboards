
<template>
  <div class="flex h-svh w-full overflow-hidden bg-card">
    <AppSidebar />
    <main id="main" class="relative min-h-svh overflow-y-auto h-full bg-background max-lg:pt-14  lg:rounded-s-4xl lg:border-s w-full grow">
      <div class="w-full">
        <AppLayoutPageHeader>
          <AppLayoutPageTitle class="max-w-screen-lg container">
            تنظیمات حساب
          </AppLayoutPageTitle>
        </AppLayoutPageHeader>
        <AppLayoutPageContent>
          <div class="grid grid-cols-12 gap-8 container max-w-screen-lg">
            <div class="col-span-12 lg:col-span-3">
              <div class="sticky top-14">
                <AppAccountSidebar />
              </div>
            </div>
            <div class="col-span-12 lg:col-span-9 ">
              <slot />
            </div>
          </div>
        </AppLayoutPageContent>
      </div>
    </main>
  </div>
</template>
