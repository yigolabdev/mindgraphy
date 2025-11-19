'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  mockProducts,
  mockPolicies,
  mockContractTemplate,
  mockVenues,
  mockPartners,
  type Venue,
  type Partner
} from '@/lib/mock/settings'
import type { Product, Policy, ContractTemplate } from '@/lib/types'
import { 
  Plus, 
  Edit, 
  FileText, 
  CheckCircle, 
  XCircle,
  Shield,
  Layers,
  Camera,
  Image as ImageIcon,
  MapPin,
  Users,
  Building2,
  Handshake,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency, cn } from '@/lib/utils'

export default function SettingsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies)
  const [contractTemplate, setContractTemplate] = useState<ContractTemplate>(mockContractTemplate)
  const [venues, setVenues] = useState<Venue[]>(mockVenues)
  const [partners, setPartners] = useState<Partner[]>(mockPartners)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create')
  const [selectedItem, setSelectedItem] = useState<Product | Policy | Venue | Partner | null>(null)
  const [activeTab, setActiveTab] = useState<'snap' | 'options' | 'policies' | 'venues' | 'partners'>('snap')
  const [formData, setFormData] = useState<any>({})
  
  const [contractDialogOpen, setContractDialogOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<ContractTemplate | null>(null)

  // Separate products by category
  const snapProducts = products.filter(p => p.category === 'SNAP')
  const options = products.filter(p => p.category === 'OPTION')

  const handleCreate = () => {
    setDrawerMode('create')
    setSelectedItem(null)
    setFormData({})
    setDrawerOpen(true)
  }

  const handleEdit = (item: Product | Policy | Venue | Partner) => {
    setDrawerMode('edit')
    setSelectedItem(item)
    setFormData(item)
    setDrawerOpen(true)
  }

  const handleSave = () => {
    if (activeTab === 'venues') {
      // Venue save logic
      const ballroomsArray = formData.ballrooms 
        ? formData.ballrooms.split(',').map((b: string) => b.trim()).filter((b: string) => b)
        : []
      
      const venueData: Venue = {
        id: drawerMode === 'create' ? `venue-${Date.now()}` : formData.id,
        name: formData.name || '',
        type: formData.type || 'wedding_hall',
        address: formData.address || '',
        phone: formData.phone || '',
        ballrooms: ballroomsArray,
        parkingInfo: formData.parkingInfo,
        notes: formData.notes,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        createdAt: drawerMode === 'create' ? new Date().toISOString().split('T')[0] : formData.createdAt,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      
      if (drawerMode === 'create') {
        setVenues([...venues, venueData])
      } else {
        setVenues(venues.map(v => v.id === venueData.id ? venueData : v))
      }
    } else if (activeTab === 'partners') {
      // Partner save logic
      const partnerData: Partner = {
        id: drawerMode === 'create' ? `partner-${Date.now()}` : formData.id,
        name: formData.name || '',
        type: formData.type || 'makeup',
        contactPerson: formData.contactPerson || '',
        phone: formData.phone || '',
        email: formData.email || '',
        address: formData.address,
        website: formData.website,
        commissionRate: formData.commissionRate ? Number(formData.commissionRate) : undefined,
        notes: formData.notes,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        createdAt: drawerMode === 'create' ? new Date().toISOString().split('T')[0] : formData.createdAt,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      
      if (drawerMode === 'create') {
        setPartners([...partners, partnerData])
      } else {
        setPartners(partners.map(p => p.id === partnerData.id ? partnerData : p))
      }
    }
    
    toast.success(
      drawerMode === 'create' ? '새 항목이 생성되었습니다' : '변경사항이 저장되었습니다'
    )
    setDrawerOpen(false)
    setFormData({})
  }

  const handleToggleStatus = (id: string) => {
    if (activeTab === 'policies') {
      setPolicies(prev => prev.map(p => 
        p.id === id ? { ...p, isActive: !p.isActive } : p
      ))
    } else if (activeTab === 'venues') {
      setVenues(prev => prev.map(v => 
        v.id === id ? { ...v, isActive: !v.isActive } : v
      ))
    } else if (activeTab === 'partners') {
      setPartners(prev => prev.map(p => 
        p.id === id ? { ...p, isActive: !p.isActive } : p
      ))
    } else {
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, isActive: !p.isActive } : p
      ))
    }
    toast.success('상태가 변경되었습니다')
  }

  const getPolicyTypeLabel = (type: Policy['type']) => {
    const labels = {
      cancellation: '취소/환불',
      refund: '환불',
      usage: '이용약관',
      privacy: '개인정보'
    }
    return labels[type]
  }

  const getVenueTypeLabel = (type: Venue['type']) => {
    const labels = {
      wedding_hall: '웨딩홀',
      hotel: '호텔',
      church: '교회',
      outdoor: '야외',
      other: '기타'
    }
    return labels[type]
  }

  const getPartnerTypeLabel = (type: Partner['type']) => {
    const labels = {
      makeup: '메이크업',
      dress: '드레스',
      studio: '스튜디오',
      planner: '플래너',
      florist: '플로리스트',
      other: '기타'
    }
    return labels[type]
  }

  // Contract handlers
  const handleEditContract = () => {
    setEditingContract({...contractTemplate})
    setContractDialogOpen(true)
  }

  const handleSaveContract = () => {
    if (editingContract) {
      setContractTemplate(editingContract)
      toast.success('계약서가 저장되었습니다')
      setContractDialogOpen(false)
    }
  }

  const handleUpdateContractArticle = (articleId: string, field: 'title' | 'content', value: string | string[]) => {
    if (!editingContract) return
    
    const updatedArticles = editingContract.articles.map(article => {
      if (article.id === articleId) {
        return { ...article, [field]: value }
      }
      return article
    })
    
    setEditingContract({
      ...editingContract,
      articles: updatedArticles
    })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">설정</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            상품, 옵션, 정책, 예식장 및 협력사를 관리하세요
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          새로 만들기
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="snap" className="flex items-center gap-1 text-xs md:text-sm">
            <Camera className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">상품관리</span>
            <span className="sm:hidden">상품</span>
          </TabsTrigger>
          <TabsTrigger value="options" className="flex items-center gap-1 text-xs md:text-sm">
            <Layers className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">추가옵션</span>
            <span className="sm:hidden">옵션</span>
          </TabsTrigger>
          <TabsTrigger value="venues" className="flex items-center gap-1 text-xs md:text-sm">
            <MapPin className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">예식장</span>
            <span className="sm:hidden">예식</span>
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex items-center gap-1 text-xs md:text-sm">
            <Users className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">협력사</span>
            <span className="sm:hidden">협력</span>
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-1 text-xs md:text-sm">
            <Shield className="h-3 w-3 md:h-4 md:w-4" />
            <span>정책</span>
          </TabsTrigger>
        </TabsList>

        {/* Snap Products Tab */}
        <TabsContent value="snap" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {snapProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">본식스냅 상품이 없습니다</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    첫 본식스냅 상품을 만들어보세요
                  </p>
                  <Button onClick={handleCreate} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    상품 만들기
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="min-w-[150px]">상품명</TableHead>
                        <TableHead className="min-w-[200px]">설명</TableHead>
                        <TableHead className="text-center">사진 수</TableHead>
                        <TableHead className="text-center">앨범</TableHead>
                        <TableHead className="text-right min-w-[120px]">가격</TableHead>
                        <TableHead className="text-center">상태</TableHead>
                        <TableHead className="text-center">액션</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {snapProducts.map((product) => (
                        <TableRow key={product.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{product.name}</p>
                                {product.id.startsWith('hanbok-') && (
                                  <Badge variant="outline" className="text-xs">
                                    HANBOK
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{product.title}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px]">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.description.slice(0, 2).join(' • ')}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="gap-1">
                              <ImageIcon className="h-3 w-3" />
                              {product.photoCount}장
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {product.albumIncluded ? (
                              <div className="flex flex-col gap-1 items-center">
                                <Badge variant="secondary">
                                  {product.albumPages}P
                                </Badge>
                                {product.miniAlbums && (
                                  <span className="text-xs text-muted-foreground">
                                    미니 {product.miniAlbums}권
                                  </span>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline">없음</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(product.basePrice)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={product.isActive ? 'default' : 'secondary'}>
                              {product.isActive ? '활성' : '비활성'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Switch
                                checked={product.isActive}
                                onCheckedChange={() => handleToggleStatus(product.id)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Options Tab */}
        <TabsContent value="options" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {options.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Layers className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">추가 옵션이 없습니다</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    첫 추가 옵션을 만들어보세요
                  </p>
                  <Button onClick={handleCreate} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    옵션 만들기
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="min-w-[150px]">옵션명</TableHead>
                        <TableHead className="min-w-[250px]">설명</TableHead>
                        <TableHead className="text-center">사진 추가</TableHead>
                        <TableHead className="text-right min-w-[120px]">가격</TableHead>
                        <TableHead className="text-center">상태</TableHead>
                        <TableHead className="text-center">액션</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {options.map((option) => (
                        <TableRow key={option.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <p className="font-medium">{option.name}</p>
                              <p className="text-xs text-muted-foreground">{option.title}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground">
                              {option.description.join(' • ')}
                            </p>
                          </TableCell>
                          <TableCell className="text-center">
                            {option.photoCount > 0 ? (
                              <Badge variant="outline" className="gap-1">
                                <ImageIcon className="h-3 w-3" />
                                +{option.photoCount}장
                              </Badge>
                            ) : (
                              <Badge variant="outline">-</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(option.basePrice)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={option.isActive ? 'default' : 'secondary'}>
                              {option.isActive ? '활성' : '비활성'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(option)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Switch
                                checked={option.isActive}
                                onCheckedChange={() => handleToggleStatus(option.id)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Venues Tab */}
        <TabsContent value="venues" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {venues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-base md:text-lg font-semibold mb-1">예식장이 없습니다</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    새 예식장을 추가하여 시작하세요
                  </p>
                  <Button onClick={handleCreate} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    첫 예식장 추가
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="min-w-[150px]">예식장명</TableHead>
                        <TableHead className="min-w-[100px]">타입</TableHead>
                        <TableHead className="min-w-[200px]">주소</TableHead>
                        <TableHead className="min-w-[120px]">연락처</TableHead>
                        <TableHead className="min-w-[80px]">홀 수</TableHead>
                        <TableHead className="min-w-[100px]">상태</TableHead>
                        <TableHead className="text-right min-w-[80px]">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {venues.map((venue) => (
                        <TableRow key={venue.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">{venue.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{getVenueTypeLabel(venue.type)}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{venue.address}</span>
                          </TableCell>
                          <TableCell>
                            <a href={`tel:${venue.phone}`} className="text-sm font-mono hover:text-primary">
                              {venue.phone}
                            </a>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant="outline">{venue.ballrooms.length}개</Badge>
                              {venue.ballrooms.length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {venue.ballrooms.slice(0, 2).join(', ')}
                                  {venue.ballrooms.length > 2 && ` 외 ${venue.ballrooms.length - 2}개`}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {venue.isActive ? (
                              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                활성
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="mr-1 h-3 w-3" />
                                비활성
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(venue)}
                              className="hover:bg-muted"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {partners.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Handshake className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-base md:text-lg font-semibold mb-1">협력사가 없습니다</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    새 협력사를 추가하여 시작하세요
                  </p>
                  <Button onClick={handleCreate} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    첫 협력사 추가
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="min-w-[150px]">협력사명</TableHead>
                        <TableHead className="min-w-[100px]">타입</TableHead>
                        <TableHead className="min-w-[100px]">담당자</TableHead>
                        <TableHead className="min-w-[120px]">연락처</TableHead>
                        <TableHead className="min-w-[180px]">이메일</TableHead>
                        <TableHead className="min-w-[80px]">수수료</TableHead>
                        <TableHead className="min-w-[100px]">상태</TableHead>
                        <TableHead className="text-right min-w-[80px]">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partners.map((partner) => (
                        <TableRow key={partner.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{partner.name}</span>
                              {partner.website && (
                                <a
                                  href={partner.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={cn(
                                partner.type === 'makeup' && 'border-pink-200 bg-pink-50 text-pink-700',
                                partner.type === 'dress' && 'border-purple-200 bg-purple-50 text-purple-700',
                                partner.type === 'studio' && 'border-blue-200 bg-blue-50 text-blue-700',
                                partner.type === 'planner' && 'border-green-200 bg-green-50 text-green-700',
                                partner.type === 'florist' && 'border-yellow-200 bg-yellow-50 text-yellow-700'
                              )}
                            >
                              {getPartnerTypeLabel(partner.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              {partner.contactPerson}
                            </div>
                          </TableCell>
                          <TableCell>
                            <a href={`tel:${partner.phone}`} className="flex items-center gap-1 text-sm font-mono hover:text-primary">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {partner.phone}
                            </a>
                          </TableCell>
                          <TableCell>
                            <a href={`mailto:${partner.email}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                              <Mail className="h-3 w-3" />
                              {partner.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            {partner.commissionRate ? (
                              <Badge variant="outline" className="font-mono">
                                {partner.commissionRate}%
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {partner.isActive ? (
                              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                활성
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="mr-1 h-3 w-3" />
                                비활성
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(partner)}
                              className="hover:bg-muted"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          {/* Contract Card */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-900">{contractTemplate.title}</span>
                    <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-700 border-blue-300">
                      {contractTemplate.version}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-blue-700/80">
                    고객용 계약서 템플릿 (고객 페이지와 동일하게 적용됩니다)
                  </p>
                </div>
                <Button onClick={handleEditContract} variant="outline" className="border-blue-300 hover:bg-blue-100">
                  <Edit className="mr-2 h-4 w-4" />
                  편집
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-600 font-medium mb-1">계약서명</p>
                  <p className="text-blue-900">{contractTemplate.name}</p>
                </div>
                <div>
                  <p className="text-blue-600 font-medium mb-1">시행일</p>
                  <p className="text-blue-900">{contractTemplate.effectiveDate}</p>
                </div>
                <div>
                  <p className="text-blue-600 font-medium mb-1">조항 수</p>
                  <p className="text-blue-900">{contractTemplate.articles.length}개 조항</p>
                </div>
              </div>
              <div className="bg-white border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-600 font-medium mb-2">포함된 조항:</p>
                <div className="flex flex-wrap gap-2">
                  {contractTemplate.articles.map((article) => (
                    <Badge key={article.id} variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                      {article.title}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-xs text-blue-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                이 계약서는 고객용 페이지 (마인드 포털)의 계약서 페이지에 자동으로 적용됩니다
              </div>
            </CardContent>
          </Card>

          {/* Policies Table */}
          <Card>
            <CardContent className="p-0">
              {policies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">정책이 없습니다</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    첫 정책을 만들어보세요
                  </p>
                  <Button onClick={handleCreate} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    정책 만들기
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="min-w-[200px]">정책명</TableHead>
                        <TableHead className="min-w-[100px]">유형</TableHead>
                        <TableHead className="min-w-[80px]">버전</TableHead>
                        <TableHead className="min-w-[120px]">시행일</TableHead>
                        <TableHead className="text-center">상태</TableHead>
                        <TableHead className="text-center">액션</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {policies.map((policy) => (
                        <TableRow key={policy.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{policy.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getPolicyTypeLabel(policy.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{policy.version}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {policy.effectiveDate}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={policy.isActive ? 'default' : 'secondary'}>
                              {policy.isActive ? '활성' : '비활성'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(policy)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Switch
                                checked={policy.isActive}
                                onCheckedChange={() => handleToggleStatus(policy.id)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Drawer for Create/Edit */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {drawerMode === 'create' ? '새로 만들기' : '수정하기'}
            </SheetTitle>
            <SheetDescription>
              {activeTab === 'snap' && '본식스냅 상품 정보를 입력하세요'}
              {activeTab === 'options' && '추가 옵션 정보를 입력하세요'}
              {activeTab === 'policies' && '정책 정보를 입력하세요'}
              {activeTab === 'venues' && '예식장 정보를 입력하세요'}
              {activeTab === 'partners' && '협력사 정보를 입력하세요'}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            {/* Venue Form */}
            {activeTab === 'venues' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="venueName">예식장명 *</Label>
                  <Input
                    id="venueName"
                    placeholder="예: 더 그랜드 웨딩홀"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venueType">타입 *</Label>
                  <select 
                    id="venueType"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.type || 'wedding_hall'}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="wedding_hall">웨딩홀</option>
                    <option value="hotel">호텔</option>
                    <option value="church">교회</option>
                    <option value="outdoor">야외</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venueAddress">주소 *</Label>
                  <Input
                    id="venueAddress"
                    placeholder="예: 서울시 강남구 테헤란로 123"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venuePhone">연락처 *</Label>
                  <Input
                    id="venuePhone"
                    placeholder="02-1234-5678"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ballrooms">보유 홀</Label>
                  <Input
                    id="ballrooms"
                    placeholder="그랜드홀, 프리미어홀, 스카이홀 (쉼표로 구분)"
                    value={formData.ballrooms || ''}
                    onChange={(e) => setFormData({...formData, ballrooms: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    홀 이름을 쉼표(,)로 구분하여 입력해주세요
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parkingInfo">주차 정보</Label>
                  <Input
                    id="parkingInfo"
                    placeholder="예: 지하 1-3층, 발렛 가능"
                    value={formData.parkingInfo || ''}
                    onChange={(e) => setFormData({...formData, parkingInfo: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venueNotes">메모</Label>
                  <Textarea
                    id="venueNotes"
                    placeholder="추가 정보나 특이사항"
                    rows={3}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </>
            )}

            {/* Partner Form */}
            {activeTab === 'partners' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="partnerName">협력사명 *</Label>
                  <Input
                    id="partnerName"
                    placeholder="예: 뷰티살롱 ABC"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerType">타입 *</Label>
                  <select 
                    id="partnerType"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.type || 'makeup'}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="makeup">메이크업</option>
                    <option value="dress">드레스</option>
                    <option value="studio">스튜디오</option>
                    <option value="planner">플래너</option>
                    <option value="florist">플로리스트</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson">담당자 *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="홍길동"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerPhone">연락처 *</Label>
                  <Input
                    id="partnerPhone"
                    placeholder="010-1234-5678"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerEmail">이메일 *</Label>
                  <Input
                    id="partnerEmail"
                    type="email"
                    placeholder="contact@example.com"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerAddress">주소</Label>
                  <Input
                    id="partnerAddress"
                    placeholder="사업장 주소"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commissionRate">수수료율 (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    placeholder="10"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.commissionRate || ''}
                    onChange={(e) => setFormData({...formData, commissionRate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerNotes">메모</Label>
                  <Textarea
                    id="partnerNotes"
                    placeholder="추가 정보나 특이사항"
                    rows={3}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </>
            )}

            {/* Product/Option Form */}
            {(activeTab === 'snap' || activeTab === 'options') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">상품/옵션 이름 *</Label>
                  <Input
                    id="name"
                    placeholder="예: new BASIC, Option 1"
                    defaultValue={selectedItem && 'category' in selectedItem ? selectedItem.name : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">표시 제목 *</Label>
                  <Input
                    id="title"
                    placeholder="예: 본식스냅 앨범형 기본상품"
                    defaultValue={selectedItem && 'category' in selectedItem ? selectedItem.title : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명 (한 줄당 하나) *</Label>
                  <Textarea
                    id="description"
                    placeholder="1인 작가 진행&#10;최종본 60장&#10;웹갤러리 제공"
                    rows={6}
                    defaultValue={selectedItem && 'category' in selectedItem ? selectedItem.description.join('\n') : ''}
                  />
                  <p className="text-xs text-muted-foreground">
                    각 줄이 하나의 설명 항목으로 표시됩니다
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="photoCount">최종 사진 수</Label>
                    <Input
                      id="photoCount"
                      type="number"
                      placeholder="60"
                      defaultValue={selectedItem && 'category' in selectedItem ? selectedItem.photoCount : 0}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="basePrice">가격 (원) *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      placeholder="1210000"
                      defaultValue={selectedItem && 'category' in selectedItem ? selectedItem.basePrice : 0}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="albumIncluded">앨범 포함</Label>
                    <Switch
                      id="albumIncluded"
                      defaultChecked={selectedItem && 'category' in selectedItem ? selectedItem.albumIncluded : false}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="albumPages">앨범 페이지 수</Label>
                    <Input
                      id="albumPages"
                      type="number"
                      placeholder="60"
                      defaultValue={selectedItem && 'category' in selectedItem ? selectedItem.albumPages || '' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="miniAlbums">미니 앨범 수</Label>
                    <Input
                      id="miniAlbums"
                      type="number"
                      placeholder="2"
                      defaultValue={selectedItem && 'category' in selectedItem ? selectedItem.miniAlbums || '' : ''}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>납품 형태</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="webGallery" className="font-normal">웹갤러리 제공</Label>
                      <Switch
                        id="webGallery"
                        defaultChecked={selectedItem && 'category' in selectedItem ? selectedItem.delivery.includesWebGallery : false}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rawDownload" className="font-normal">전체원본 제공</Label>
                      <Switch
                        id="rawDownload"
                        defaultChecked={selectedItem && 'category' in selectedItem ? selectedItem.delivery.includesRawDownload : false}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Policy Form */}
            {activeTab === 'policies' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="policyName">정책명 *</Label>
                  <Input
                    id="policyName"
                    placeholder="예: 취소 및 환불 규정"
                    defaultValue={selectedItem && 'content' in selectedItem ? selectedItem.name : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policyVersion">버전 *</Label>
                  <Input
                    id="policyVersion"
                    placeholder="예: v2.1"
                    defaultValue={selectedItem && 'version' in selectedItem ? selectedItem.version : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policyContent">정책 내용 (Markdown 지원) *</Label>
                  <Textarea
                    id="policyContent"
                    placeholder="## 정책 제목&#10;### 세부 내용"
                    rows={10}
                    defaultValue={selectedItem && 'content' in selectedItem ? selectedItem.content : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">시행일 *</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    defaultValue={selectedItem && 'effectiveDate' in selectedItem ? selectedItem.effectiveDate : ''}
                  />
                </div>
              </>
            )}
          </div>

          <SheetFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSave}>
              {drawerMode === 'create' ? '생성' : '저장'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Contract Edit Dialog */}
      <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              계약서 편집
            </DialogTitle>
            <DialogDescription>
              고객용 페이지의 계약서 내용을 수정합니다. 저장하면 즉시 고객 페이지에 반영됩니다.
            </DialogDescription>
          </DialogHeader>

          {editingContract && (
            <div className="space-y-6 py-4">
              {/* Contract Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractTitle">계약서 제목</Label>
                  <Input
                    id="contractTitle"
                    value={editingContract.title}
                    onChange={(e) => setEditingContract({...editingContract, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractVersion">버전</Label>
                  <Input
                    id="contractVersion"
                    value={editingContract.version}
                    onChange={(e) => setEditingContract({...editingContract, version: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractDescription">계약서 설명</Label>
                <Textarea
                  id="contractDescription"
                  value={editingContract.description}
                  onChange={(e) => setEditingContract({...editingContract, description: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  계약서 조항
                </h3>
                <div className="space-y-6">
                  {editingContract.articles.map((article) => (
                    <Card key={article.id} className="border-zinc-200">
                      <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`article-title-${article.id}`}>
                            {article.order}번 조항 제목
                          </Label>
                          <Input
                            id={`article-title-${article.id}`}
                            value={article.title}
                            onChange={(e) => handleUpdateContractArticle(article.id, 'title', e.target.value)}
                            placeholder="예: 제1조 (계약 당사자)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`article-content-${article.id}`}>
                            조항 내용 (한 줄당 하나의 항목)
                          </Label>
                          <Textarea
                            id={`article-content-${article.id}`}
                            value={article.content.join('\n')}
                            onChange={(e) => handleUpdateContractArticle(article.id, 'content', e.target.value.split('\n'))}
                            rows={Math.max(4, article.content.length)}
                            placeholder="① 첫 번째 항목&#10;② 두 번째 항목&#10;※ 비고 사항"
                            className="font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            💡 변수 사용 가능: {'{weddingDate}, {weddingTime}, {venue}, {packageName}, {totalAmount}, {depositAmount}, {balanceAmount}, {contractDate}'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contractFooter">하단 문구</Label>
                  <Input
                    id="contractFooter"
                    value={editingContract.footer}
                    onChange={(e) => setEditingContract({...editingContract, footer: e.target.value})}
                    placeholder="계약 체결일: {contractDate}"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractNotice">중요 안내</Label>
                  <Textarea
                    id="contractNotice"
                    value={editingContract.importantNotice}
                    onChange={(e) => setEditingContract({...editingContract, importantNotice: e.target.value})}
                    rows={3}
                    placeholder="본 계약서의 법적 효력 및 주의사항"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setContractDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveContract} className="bg-blue-600 hover:bg-blue-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
